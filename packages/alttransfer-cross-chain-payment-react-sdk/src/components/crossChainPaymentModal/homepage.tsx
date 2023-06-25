import React from "react";
import { useAccount } from "wagmi";
import { RightIconButton } from "../../assets/iconButtons";
import type { constInfoType } from "../CrossChainPaymentModal";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";
import type { chainsDataType } from "./chains-data";
import { chainsData } from "./chains-data";

export default function HomePage({
  setCurrentScreen,
  curChain,
  costInfo,
  brandName,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
  curChain: string;
  costInfo: constInfoType;
  brandName: string;
}) {
  const { isConnected } = useAccount();

  return (
    <>
      {/* FIRST ROW -> TITLE + CLOSE BUTTON */}
      <NavBar title={brandName} setCurrentScreen={setCurrentScreen} />

      {/* SECOND SECTION -> token / chain / cost */}
      <div className={`SectionContainer`}>
        <div className="splitText">
          <button
            className="HomepageSelectButton"
            onClick={() => {
              setCurrentScreen(pages.SelectToken);
            }}
            style={{ opacity: isConnected ? "1" : "0.35" }}
            disabled={isConnected ? false : true}
          >
            token
          </button>
          <button
            className="HomepageSelectButton"
            onClick={() => {
              setCurrentScreen(pages.SelectChain);
            }}
            style={{ opacity: isConnected ? "1" : "0.35" }}
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
          {/* THESE COMMENTS ARE TO ADD price and unit */}
          {/* <div
            style={{
              display: "inline-flex",
              alignItems: "flex-end",
              gap: "0.5em",
            }}
          > */}
          <div className="largeText">{costInfo.curCostInToken}</div>
          {/* <div style={{ color: "var(--tertiary-text)" }}>
              ≈${costInfo.curCostInUSDC + " (" + costInfo.rate + ")"}
            </div> */}
          {/* </div> */}
          <div style={{ color: "var(--tertiary-text)" }}>
            {isConnected ? `Balance: ${costInfo.bal}` : ""}
          </div>
        </div>
      </div>

      <div className="SectionContainer">
        <div className="splitText">
          Cost
          <div>${costInfo.cost + " " + "USD"}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="Button sky"
          onClick={() => {
            if (!isConnected) setCurrentScreen(pages.ModifyWallet);
            else {
              setCurrentScreen(pages.ConfirmPayment);
            }
          }}
        >
          {isConnected ? "Pay" : "Connect Wallet"}
        </button>
      </div>
    </>
  );
}
