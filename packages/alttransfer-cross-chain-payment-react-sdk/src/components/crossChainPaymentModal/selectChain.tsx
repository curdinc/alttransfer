import React, { useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { defaultCurrency, useCrossChainPayment } from "../CrossChainPaymentContext";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";
import { ChainsDataType, chainHex, chainsData, chainsID } from "./chains-data";
import "./defaultModal.css";

export default function SelectChain({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { currentChain, setCurrentChain, setCurrency } = useCrossChainPayment();
  const {isConnected} = useAccount()

  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork, } =
    useSwitchNetwork();
  var intersectionChains = chains
    .map((item, i) => {
      return chainHex.has(item.id.toString(16)) ? item.name : null;
    })
    .filter((value) => value != null);
  var supportedChains = intersectionChains.map((item, i) => item ?? "");

  useEffect(() => {
    if (isConnected && chainsID.has(chain?.name??"")) {
      setCurrentChain(chain?.name as any?? "Chain")
    }else {
      setCurrentChain("Chain")
    }
  }, [isConnected])

  
  return (
    <>
      <NavBar
        backLink={pages.HomeScreen}
        title="Select chain"
        setCurrentScreen={setCurrentScreen}
      />
      {supportedChains.map((item) => (
        <button
          key={item}
          className="ModifyWalletButton"
          style={{
            backgroundColor:
              item === currentChain ? "var(--secondary)" : "null",
          }}
          onClick={() => {
            setCurrentChain(item as ChainsDataType);
            if (chainsID.has(item)) {
              switchNetwork?.(parseInt(chainsID.get(item) ?? ""));
            }
            setCurrency(defaultCurrency)
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
