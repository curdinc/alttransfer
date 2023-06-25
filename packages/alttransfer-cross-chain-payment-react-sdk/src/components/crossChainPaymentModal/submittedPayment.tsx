import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";
import { pages } from "../CrossChainPaymentModal";
import "./defaultModal.css";
import NavBar from "../navBar";

export default function SubmittedPayment({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  return (
    <>
      <NavBar title="Payment submitted" setCurrentScreen={setCurrentScreen} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em' }}>
        Payment submitted successfully
        <div>View receipt</div>
      </div>
    </>
  );
}
