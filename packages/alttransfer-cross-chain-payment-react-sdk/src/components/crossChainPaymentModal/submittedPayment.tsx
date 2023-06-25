import React from "react";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";

export default function SubmittedPayment({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  return (
    <>
      <NavBar title="Payment submitted" setCurrentScreen={setCurrentScreen} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1em",
        }}
      >
        <div className="checkmark-wrapper circle" style={{margin:"1em"}}>
          <span className="checkmark"/>
        </div>
        Payment submitted successfully
        <div>View receipt</div>
      </div>
    </>
  );
}
