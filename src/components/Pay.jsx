import axios from "axios";
import { useSelector } from "react-redux";
import { API } from '../utils';

const PayButton = ({ cartItems }) => {
  const user = useSelector((state) => state.auth);

  const handleCheckout = () => {
    axios
      .post(API+`/api/orders/create-checkout-session`, {
        cartItems,
        userId: user._id,
      })
      .then((response) => {
        console.log(response,'response');
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Check out</button>
    </>
  );
};

export default PayButton;
