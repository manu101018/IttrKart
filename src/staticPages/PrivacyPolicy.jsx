import React from "react";
import "./termsAndPrivacy.css";
import { useNavigate } from "react-router-dom";
import { privacyPolicyAPI } from "./privacyPolicyAPI";
const PrivacyPolicy = () => {
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
        <h1>Privacy Policy</h1>

        <div className="conditions">
          <p className="description top-desc">
            This Privacy Policy describes how Ittrkart collects, uses, and
            discloses your Personal Information when you visit or make a
            purchase from the Site.
          </p>
          {privacyPolicyAPI.map((item, index) => {
            return (
              <>
                <p className="heading">{item.heading}</p>
                <p className="description">{item.desc}</p>
              </>
            );
          })}
        </div>
        <button onClick={backToPreviousPage}>Go Back</button>
      </div>
    </>
  );
};

export default PrivacyPolicy;
