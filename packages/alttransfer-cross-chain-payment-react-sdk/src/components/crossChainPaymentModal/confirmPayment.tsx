import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";
import type { constInfoType } from "../CrossChainPaymentModal";
import { pages } from "../CrossChainPaymentModal";
import "./defaultModal.css";
import NavBar from "../navBar";
export default function ConfirmPayment({
  setCurrentScreen,
  currentChain,
  costInfo
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
  currentChain: string;
  costInfo: constInfoType;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    if (doneLoading) setCurrentScreen(pages.SubmittedPayment);
    console.log('done loading')
  }, [doneLoading, setCurrentScreen])

  return (
    <>
      <NavBar title="Confirm payment" setCurrentScreen={setCurrentScreen} backLink={pages.HomeScreen} />
      {
        !isLoading && !doneLoading && (
          <>
            {/* REPLACE WITH CORRECT CONVERSION */}
            <div>{`1 ${costInfo.curToken} = 21.492 ETH`}</div>

            <div className={`SectionContainer`}>
              <div className="splitText">
                <div>Actual input</div>
                <div>{costInfo.curCostInToken + " " + costInfo.curToken}</div>
              </div>
              <div className="splitText">
                <div>Expected output</div>
                <div>{costInfo.cost + " " + "USD"}</div>
              </div>
              <div className="splitText" style={{ boxShadow: "0 -1px 0 var(--border-emphasis)", paddingTop: "1em" }}>
                <div>Destination</div>
                <div>Brand name</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                className="Button"
                onClick={() => {
                  // setCurrentScreen(pages.SubmittedPayment);
                  // call API here, when returned set doneLoading = true
                  setIsLoading(true);
                }}
              >
                Confirm payment
              </button>
            </div>
          </>
        )
      }

      {
        isLoading && !doneLoading && (
          <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center', gap: "1em", marginBottom: '1em' }}>
            <div className="lds-ring" style={{ margin: "1em 0em" }}><div></div><div></div><div></div><div></div></div>
            <div>Confirm this transaction in your wallet</div>
            <div style={{ color: "var(--tertiary-text)", fontSize: "0.9em" }}
              // REMOVE THIS
              onClick={() => {
                setDoneLoading(true)
              }}>
              {"Paying " + costInfo.curCostInToken + costInfo.curToken + " to Your Brand Name"}
            </div>
          </div>
        )
      }


    </>
  );
}
