import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import type { constInfoType } from "../CrossChainPaymentModal";
import { pages } from "../CrossChainPaymentModal";
import type { chainsDataType } from "./chains-data";
import { chainsData } from "./chains-data";
import "./defaultmodal.css";
import { CrossIconButton, RightIconButton } from "./iconButtons";

export default function HomePage({
  setCurrentScreen,
  curChain,
  costInfo
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
  curChain: string;
  costInfo: constInfoType;
}) {
  // REPLACE THIS
  const [isConnected, setIsConnected] = useState(false);

  return (
    <>
      {/* FIRST ROW -> TITLE + CLOSE BUTTON */}
      <div className="DialogHeading">
        <div className="IconButton" style={{opacity: 0}}/>
        <Dialog.Title className="DialogTitle">Skylar Pays</Dialog.Title>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <CrossIconButton />
          </button>
        </Dialog.Close>
      </div>

      {/* SECOND SECTION -> token / chain / cost */}
      {/* check IF WALLET IS CONNECTED */}
      <div className={`SectionContainer`}>
        <div
          className="splitText"
        >
          <button
            className="HomepageSelectButton"
            onClick={() => {
              setCurrentScreen(pages.SelectToken);
            }}
            style={{ opacity: isConnected ? "1" : "0.75" }}
            disabled={isConnected ? false : true}
          >
            token
          </button>
          <button
            className="HomepageSelectButton"
            onClick={() => {
              setCurrentScreen(pages.SelectChain);
            }}
            style={{ opacity: isConnected ? "1" : "0.75" }}
            disabled={isConnected ? false : true}
          >
            {chainsData[curChain as chainsDataType]}
            {curChain}
            {<RightIconButton />}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "flex-end",
              gap: "0.5em",
            }}
          >
            <div style={{ color: "var(--primary-text)", fontSize: "1.75em" }}>
              {costInfo.curCostInToken}
            </div>
            <div style={{ color: "var(--tertiary-text)" }}>
              ≈${costInfo.curCostInUSDC + " (" + costInfo.rate + ")"}
            </div>
          </div>
          <div style={{ color: "var(--tertiary-text)" }}>Balance: {costInfo.bal}</div>
        </div>
      </div>

      <div className="SectionContainer">
          <div className="splitText">
            Cost
            <div>${costInfo.cost+" "+"USD"}</div>
          </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="Button sky"
          onClick={() => {
            if (!isConnected) setCurrentScreen(pages.ModifyWallet);
            else setCurrentScreen(pages.ConfirmPayment);
          }}
        >
          {
            isConnected ? "Pay" : "Connect Wallet"
          }
        </button>
      </div>
    </>
  );
}
