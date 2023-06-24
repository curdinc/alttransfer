import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CrossIconButton, LeftIconButton } from "./iconButtons";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";

export default function SubmittedPayment({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  return (
    <>
      <div className="DialogHeading">
        <button className="IconButton" style={{opacity: 0}} />
        <Dialog.Title className="DialogTitle">Payment submitted</Dialog.Title>
        <Dialog.Close asChild onClick={() => {setCurrentScreen(pages.HomeScreen)}}>
          <button className="IconButton" aria-label="Close">
            <CrossIconButton />
          </button>
        </Dialog.Close>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: '1em' }}>
        Payment submitted successfully
        <div>View receipt</div>
      </div>
    </>
  );
}
