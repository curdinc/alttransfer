import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CrossIconButton, RightIconButton } from "./iconButtons";
import type { chainsDataType } from "./chains-data";
import { chainsData } from "./chains-data";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";

// replace
const curToken = "something";
const curCostInToken = "0.353";
const curCostInUSDC = "6339.2";
const rate = "-0.5%";
const bal = "0";
export default function HomePage({
  setCurrentScreen,
  curChain,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
  curChain: string;
}) {
  const [isConnected, setIsConnected] = useState(true);

  return (
    <Dialog.Content className="DialogContent">
      {/* FIRST ROW -> TITLE + CLOSE BUTTON */}
      <div className="DialogHeading">
        <div></div>
        <Dialog.Title className="DialogTitle">Skylar Pays</Dialog.Title>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <CrossIconButton />
          </button>
        </Dialog.Close>
      </div>

      {/* SECOND SECTION -> token / chain / cost */}
      {/* check IF WALLET IS CONNECTED */}
      <div className={`HomepageCostSelectorContainer`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
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
              {curCostInToken}
            </div>
            <div style={{ color: "var(--tertiary-text)" }}>
              ≈${curCostInUSDC + " (" + rate + ")"}
            </div>
          </div>
          <div style={{ color: "var(--tertiary-text)" }}>Balance: {bal}</div>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: 25, justifyContent: "center" }}>
        <button
          className="Button sky"
          onClick={() => {
            setCurrentScreen(pages.ModifyWallet);
          }}
        >
          Connect Wallet
        </button>
      </div>
    </Dialog.Content>
  );
}
