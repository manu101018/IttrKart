import { useEffect} from "react";
import {useNavigate} from 'react-router-dom';
// import { useDispatch, useSelector } from "react-redux";

const CheckoutSuccess = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     navigate('/another-page'); // Replace '/another-page' with the desired path
  //   }, 5000); // 5000 milliseconds = 5 seconds

  //   return () => {
  //     clearTimeout(timeout); // Clear the timeout if the component unmounts before the delay is completed
  //   };
  // }, [navigate]);
  // const cart = useSelector((state) => state.cart);

  // useEffect(() => {
  //   dispatch(clearCart());
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getTotals());
  // }, [cart, dispatch]);

  return (
    <div
      style={{
        minHeight: "80vh",
        maxWidth: "800px",
        width: "100%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          marginBottom: "0.5rem",
          color: "#029e02",
        }}
      >
        Checkout Successful
      </h2>
      <p>Your order might take some time to process.</p>
      <p>Check your order status at your profile after about 10mins.</p>
      <p>
        Incase of any inqueries contact the support at{" "}
        <strong>manjeetkakran66@gmail.com</strong>
      </p>
    </div>
  );
};

export default CheckoutSuccess;

// const Container =
//   min-height: 80vh;
//   max-width: 800px;
//   width: 100%;
//   margin: auto;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;

//   h2 {
//     margin-bottom: 0.5rem;
//     color: #029e02;
//   }
// `;
