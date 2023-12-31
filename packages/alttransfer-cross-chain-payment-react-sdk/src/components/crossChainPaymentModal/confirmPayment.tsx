import React, { useEffect, useState } from "react";
import { pages } from "../CrossChainPaymentModal";

import { parseUnits } from "viem";
import { useWalletClient } from "wagmi";
import { useDestinationInfo } from "../../hooks/useDestinationInfo";
import { getCurrencyToBePaid } from "../../units/blockchain";
import { formatCurrency } from "../../units/formatCurrency";
import { useCrossChainPayment } from "../CrossChainPaymentContext";
import NavBar from "../navBar";
export default function ConfirmPayment({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const { currency, sdk, setTxnLink } = useCrossChainPayment();
  const { data: walletClient } = useWalletClient();
  const { isLoadingDestinationInfo, destinationInfo, destinationError } =
    useDestinationInfo();
  const balanceToBePaid = getCurrencyToBePaid(
    currency,
    destinationInfo?.itemInfo
  );

  if (destinationError) {
    console.error(destinationError);
    return (
      <>
        <NavBar
          title="Confirm payment"
          setCurrentScreen={setCurrentScreen}
          backLink={pages.HomeScreen}
        />
        <div>Something went wrong fetching payment information</div>;
      </>
    );
  }
  if (isLoadingDestinationInfo) {
    return (
      <>
        <NavBar
          title="Confirm payment"
          setCurrentScreen={setCurrentScreen}
          backLink={pages.HomeScreen}
        />
        <div className="text-center">Loading...</div>
      </>
    );
  }

  useEffect(() => {
    if (doneLoading) setCurrentScreen(pages.SubmittedPayment);
  }, [doneLoading, setCurrentScreen]);

  return (
    <>
      <NavBar
        title="Confirm payment"
        setCurrentScreen={setCurrentScreen}
        backLink={pages.HomeScreen}
      />
      {!isLoading && !doneLoading && (
        <>
          {/* REPLACE WITH CORRECT CONVERSION */}
          {/* <div>{`1 ${destinationInfo?.itemInfo.symbol} = ${conversion} ${currency.symbol}`}</div> */}

          <div className={`SectionContainer`}>
            <div className="splitText">
              <div>Paying with</div>
              <div>{balanceToBePaid + " " + currency.symbol}</div>
            </div>
            <div className="splitText">
              <div>Item Cost</div>
              <div>
                {formatCurrency(
                  destinationInfo?.itemInfo.balanceUsdValueCents || "0"
                ) +
                  " " +
                  "USD"}
              </div>
            </div>
            <div
              className="splitText"
              style={{
                boxShadow: "0 -1px 0 var(--border-emphasis)",
                paddingTop: "1em",
              }}
            >
              <div>Paying To</div>
              <div>{sdk.text.brandName}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="Button"
              onClick={() => {
                // setCurrentScreen(pages.SubmittedPayment);
                // call API here, when returned set doneLoading = true
                if (!walletClient) return console.error("No wallet client");
                setIsLoading(true);
                sdk
                  .pay({
                    currency,
                    payingAmount: parseUnits(
                      balanceToBePaid,
                      currency.decimals
                    ).toString(),
                    walletClient,
                  })
                  .catch((e) => {
                    console.error(e);
                    setIsLoading(false);
                  })
                  .then((result) => {
                    if (result) {
                      setTxnLink(result);
                      setIsLoading(false);
                      setDoneLoading(true);
                    }
                  });
              }}
            >
              Confirm payment
            </button>
          </div>
        </>
      )}

      {isLoading && !doneLoading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1em",
            marginBottom: "1em",
          }}
        >
          <div
            className="checkmark-wrapper spinner"
            style={{ margin: "1em" }}
          ></div>
          <div>Confirm this transaction in your wallet</div>
          <div style={{ color: "var(--tertiary-text)", fontSize: "0.9em" }}>
            {"Paying " +
              balanceToBePaid +
              " " +
              currency.symbol +
              " to Your Brand Name"}
          </div>
        </div>
      )}
    </>
  );
}
