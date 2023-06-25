import React from "react";
import { useCrossChainPayment } from "../CrossChainPaymentContext";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";
import type { ChainsDataType } from "./chains-data";
import { chainsData } from "./chains-data";

export default function SelectChain({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { currentChain, setCurrentChain } = useCrossChainPayment();
  return (
    <>
      <NavBar
        backLink={pages.HomeScreen}
        title="Select chain"
        setCurrentScreen={setCurrentScreen}
      />
      {Object.keys(chainsData).map((item) => (
        <button
          key={item}
          className="ModifyWalletButton"
          style={{
            backgroundColor:
              item === currentChain ? "var(--secondary)" : "null",
          }}
          onClick={() => {
            setCurrentChain(item as ChainsDataType);
            setCurrentScreen(pages.HomeScreen);
          }}
        >
          <div className="headerText">{item}</div>
          {chainsData[item as ChainsDataType]}
        </button>
      ))}
    </>
  );
}
