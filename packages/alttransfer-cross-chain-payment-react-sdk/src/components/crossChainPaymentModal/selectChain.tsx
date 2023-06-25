import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { chainsDataType } from "./chains-data";
import { chainsData } from "./chains-data";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";
import { pages } from "../CrossChainPaymentModal";
import "./defaultModal.css";
import NavBar from "../navBar";

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
      <NavBar backLink={pages.HomeScreen} title="Select chain" setCurrentScreen={setCurrentScreen} />
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
