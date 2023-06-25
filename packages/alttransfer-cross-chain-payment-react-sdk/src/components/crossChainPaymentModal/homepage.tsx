import React from "react";
import { useAccount } from "wagmi";
import { RightIconButton } from "../../assets/iconButtons";
import { useDestinationInfo } from "../../hooks/useDestinationInfo";
import { getCurrencyToBePaid } from "../../units/blockchain";
import { formatCurrency } from "../../units/formatCurrency";
import { useCrossChainPayment } from "../CrossChainPaymentContext";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";
import { chainsData } from "./chains-data";

export default function HomePage({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { isConnected } = useAccount();
  const { currentChain, currency, sdk } = useCrossChainPayment();

  const onClick = () => {
    if (!isConnected) setCurrentScreen(pages.ModifyWallet);
    if (!currency.address) setCurrentScreen(pages.SelectToken);
    else {
      setCurrentScreen(pages.ConfirmPayment);
    }
  };

  const { isLoadingDestinationInfo, destinationInfo, destinationError } =
    useDestinationInfo();

  if (destinationError) {
    console.error(destinationError);
    return (
      <>
        <NavBar
          title={sdk.text.brandName}
          setCurrentScreen={setCurrentScreen}
        />
        <div>Something went wrong fetching payment information</div>
      </>
    );
  }
  if (isLoadingDestinationInfo) {
    return (
      <>
        <NavBar
          title={sdk.text.brandName}
          setCurrentScreen={setCurrentScreen}
        />
        <div className="text-center">Loading...</div>
      </>
    );
  }

  const balanceToBePaid = getCurrencyToBePaid(
    currency,
    destinationInfo?.itemInfo
  );

  return (
    <>
      {/* FIRST ROW -> TITLE + CLOSE BUTTON */}
      <NavBar title={sdk.text.brandName} setCurrentScreen={setCurrentScreen} />

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
            {currency.address ? (
              <>
                {currency.tokenUri && (
                  <img
                    className="h-6 w-6 rounded-full image-cover"
                    src={currency.tokenUri}
                  />
                )}
                {currency.symbol}
              </>
            ) : (
              "token"
            )}
          </button>
          <button
            className="HomepageSelectButton"
            onClick={() => {
              setCurrentScreen(pages.SelectChain);
            }}
            style={{ opacity: isConnected ? "1" : "0.35" }}
            disabled={isConnected ? false : true}
          >
            {chainsData[currentChain]}
            {currentChain}
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
          <div className="largeText">{balanceToBePaid}</div>
          {/* <div style={{ color: "var(--tertiary-text)" }}>
              ≈${.curCostInUSDC + " (" + .rate + ")"}
            </div> */}
          {/* </div> */}
          <div style={{ color: "var(--tertiary-text)" }}>
            {isConnected ? `Balance: ${currency.formattedBalance}` : ""}
          </div>
        </div>
      </div>

      <div className="SectionContainer">
        <div className="splitText">
          Cost
          <div>
            {formatCurrency(
              destinationInfo?.itemInfo.balanceUsdValueCents || "0"
            ) +
              " " +
              "USD"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="Button sky" onClick={onClick}>
          {isConnected ? "Pay" : "Connect Wallet"}
        </button>
      </div>
    </>
  );
}
