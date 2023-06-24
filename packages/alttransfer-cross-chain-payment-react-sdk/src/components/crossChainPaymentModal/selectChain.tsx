import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { chainsDataType } from "./chains-data";
import { chainsData } from "./chains-data";
import { CrossIconButton, LeftIconButton } from "./iconButtons";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";

export default function SelectChain({
  setCurrentScreen,
  currentChain,
  setCurrentChain,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
  currentChain: string;
  setCurrentChain: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <div className="DialogHeading">
        <button
          className="IconButton"
          aria-label="Back"
          onClick={() => {
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
      {Object.keys(chainsData).map((item, i) => (
        <button
          className="ModifyWalletButton"
          style={{
            backgroundColor:
              item === currentChain ? "var(--secondary)" : "null",
          }}
          onClick={() => {
            setCurrentChain(item);
            setCurrentScreen(pages.HomeScreen);
          }}
        >
          <div className="headerText">{item}</div>
          {chainsData[item as chainsDataType]}
        </button>
      ))}
    </>
  );
}
