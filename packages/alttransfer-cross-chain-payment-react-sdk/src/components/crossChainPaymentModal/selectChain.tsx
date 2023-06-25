import React from "react";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";
import type { chainsDataType } from "./chains-data";
import { chainsData } from "./chains-data";

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
      <NavBar
        backLink={pages.HomeScreen}
        title="Select chain"
        setCurrentScreen={setCurrentScreen}
      />
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
