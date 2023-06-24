import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CrossIconButton, LeftIconButton } from "./iconButtons";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";

export default function SelectToken({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  return (
    <Dialog.Content className="DialogContent">
      <div className="DialogHeading">
        <button
          className="IconButton"
          aria-label="Back"
          onClick={() => {
            console.log("hello");
            console.log("hello");
            console.log("hello");
            console.log("hello");
            console.log("hello");
            console.log("hello");
            console.log("hello");
            setCurrentScreen(pages.HomeScreen);
          }}
        >
          <LeftIconButton />
        </button>
        <Dialog.Title className="DialogTitle">Select token</Dialog.Title>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <CrossIconButton />
          </button>
        </Dialog.Close>
      </div>
      <fieldset className="Fieldset">
        <input
          className="Input"
          id="name"
          placeholder="Search name or paste address"
        />
      </fieldset>
    </Dialog.Content>
  );
}
