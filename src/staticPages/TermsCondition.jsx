import React from "react";
import "./termsAndPrivacy.css";
import { useNavigate } from "react-router-dom";
import { termsOfServices } from "./TermsOfServices";
const TermsCondition = () => {

  const topView = () => {
    window.scrollTo({ top: 0 });
  };

  topView();

  const navigate = useNavigate();
  const backToPreviousPage = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="terms-conditions-container">
        {/* <h1>Terms Of Service</h1> */}

        <div className="conditions">
          {termsOfServices.map((item, index) => {
            return (
              <>
                <p className="heading">{item.heading}</p>
                <p className="description">{item.description}</p>
              </>
            );
          })}
        </div>
        <button onClick={backToPreviousPage}>Go Back</button>
      </div>
    </>
  );
};

export default TermsCondition;
