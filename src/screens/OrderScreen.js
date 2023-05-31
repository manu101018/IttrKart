import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";
import Stripe from "stripe";
import { API } from "../utils";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };

    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const [isPayed, SetisPayed] = useState(false);
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const location = useLocation();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          API + `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(API + `/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/login");
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      setTimeout(()=>{
        fetchOrder();
      },20000)
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(API + "/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        API + `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is out for delivery");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  const placeOrderHandler = (event) => {
    event.preventDefault();
    SetisPayed(true);
    // toast.success('Payment successfull');
    const loadPaypalScript = async () => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          API + `/api/orders/${order._id}/pay`,
          {
            id: order._id,
            status: "Yes",
            update_time: new Date().toLocaleString("en-GB"),
            user: order.user,
          },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
          );
          
        const data2 = await axios.post(
          API + `/api/orders/create-checkout-session`,
          {
            OrderID: order._id,
            cartItems: order.orderItems,
            userId: userInfo._id,
          }
          );
          window.open(data2.data.session.url, "_blank");
          setTimeout(() => {
            window.close();
          }, 1000);
          setTimeout(()=>{
            deliverOrderHandler()
          },20000)
          dispatch({ type: "PAY_SUCCESS", payload: data });
          // toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    };
    loadPaypalScript();
  };
  
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}. &nbsp; &nbsp;
                {order.shippingAddress.location &&
                  order.shippingAddress.location.lat && (
                    <a
                      target="_new"
                      href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                      style={{ color: "blue" }}
                    >
                      Show On Map
                    </a>
                  )}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  <span>
                    Out for Delivery at {new Date().toLocaleString("en-GB")}
                  </span>
                  <span>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{ border: "1px #404040 solid", margin: "1rem" }}
                      >
                        <div style={{ padding: "1rem" }}>
                          <h2>Current status</h2>
                          <p>To be dispatch from: Forever Fragnance, Kannauj</p>
                          <p>
                            Destination: {order.shippingAddress.address},
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.postalCode},
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </span>
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
              {/* {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )} */}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {new Date().toLocaleString("en-GB")}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
              {/* {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )} */}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={API + "/" + item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>Rs.{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>Rs.{order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>Rs.{order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>Rs.{order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>Rs.{order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        {/* <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons> */}
                        <button
                          type="submit"
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "16px",
                            marginTop: "20px",
                          }}
                          onClick={placeOrderHandler}
                        >
                          Pay
                        </button>
                      </div>
                      // <div
                      //   style={{
                      //     width: "400px",
                      //     margin: "5px -24px",
                      //     padding: "20px",
                      //     border: "1px solid #ccc",
                      //     backgroundColor: "#f9f9f9",
                      //   }}
                      // >
                      //   <h2 style={{ textAlign: "center" }}>
                      //     Card Information
                      //   </h2>
                      //   <form onSubmit={FormSubmitHndler}>
                      //     {/* <form onSubmit={this.handleSubmit}> */}
                      //     <label
                      //       htmlFor="cardNumber"
                      //       style={{ marginBottom: "10px", display: "block" }}
                      //     >
                      //       Card Number:
                      //     </label>
                      //     <input
                      //       type="text"
                      //       id="cardNumber"
                      //       name="cardNumber"
                      //       placeholder="Enter card number"
                      //       style={{
                      //         width: "100%",
                      //         padding: "10px",
                      //         border: "1px solid #ccc",
                      //         borderRadius: "4px",
                      //       }}
                      //       // value={this.state.cardNumber}
                      //       // onChange={this.handleChange}
                      //       required
                      //     />

                      //     <label
                      //       htmlFor="expireOn"
                      //       style={{ marginBottom: "10px", display: "block" }}
                      //     >
                      //       Expire On:
                      //     </label>
                      //     <input
                      //       type="text"
                      //       id="expireOn"
                      //       name="expireOn"
                      //       placeholder="MM/YY"
                      //       style={{
                      //         width: "100%",
                      //         padding: "10px",
                      //         border: "1px solid #ccc",
                      //         borderRadius: "4px",
                      //       }}
                      //       // value={this.state.expireOn}
                      //       // onChange={this.handleChange}
                      //       required
                      //     />

                      //     <label
                      //       htmlFor="csv"
                      //       style={{ marginBottom: "10px", display: "block" }}
                      //     >
                      //       CSV:
                      //     </label>
                      //     <input
                      //       type="text"
                      //       id="csv"
                      //       name="csv"
                      //       placeholder="Enter CSV"
                      //       style={{
                      //         width: "100%",
                      //         padding: "10px",
                      //         border: "1px solid #ccc",
                      //         borderRadius: "4px",
                      //       }}
                      //       // value={this.state.csv}
                      //       // onChange={this.handleChange}
                      //       required
                      //     />

                      //     <label
                      //       htmlFor="cardHolderName"
                      //       style={{ marginBottom: "10px", display: "block" }}
                      //     >
                      //       Card Holder Name:
                      //     </label>
                      //     <input
                      //       type="text"
                      //       id="cardHolderName"
                      //       name="cardHolderName"
                      //       placeholder="Enter card holder name"
                      //       style={{
                      //         width: "100%",
                      //         padding: "10px",
                      //         border: "1px solid #ccc",
                      //         borderRadius: "4px",
                      //       }}
                      //       // value={this.state.cardHolderName}
                      //       // onChange={this.handleChange}
                      //       required
                      //     />

                      //     {!isPayed && (
                      //       <button
                      //         type="submit"
                      //         style={{
                      //           backgroundColor: "#4CAF50",
                      //           color: "white",
                      //           padding: "10px 20px",
                      //           border: "none",
                      //           borderRadius: "4px",
                      //           cursor: "pointer",
                      //           fontSize: "16px",
                      //           marginTop: "20px",
                      //         }}
                      //       >
                      //         Pay
                      //       </button>
                      //     )}
                      //   </form>
                      // </div>
                      // <div>
                      //   <PayButton type="button" onClick={StripePayment}>Pay</PayButton>
                      //   <script scr="https://js.stripe.com/v3/"></script>
                      // </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
                {order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                {/* {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )} */}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
