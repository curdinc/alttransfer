import React from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";
import type { chainsDataType } from "./chains-data";
import { chainHex, chainsData, chainsID } from "./chains-data";
import "./defaultModal.css";

export default function SelectChain({
  setCurrentScreen,
  currentChain,
  setCurrentChain,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
  currentChain: string;
  setCurrentChain: React.Dispatch<React.SetStateAction<string>>;
}) {

  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()
  var intersectionChains = chains.map((item, i) => (chainHex.has(item.id.toString(16)) ? item.name : null)).filter((value) => (value != null))
  var supportedChains = intersectionChains.map((item, i) => (item ?? ""))
  return (
    <>
      <NavBar backLink={pages.HomeScreen} title="Select chain" setCurrentScreen={setCurrentScreen} />
      {
        supportedChains.map((item, i) => (
          <button
            className="ModifyWalletButton"
            style={{
              backgroundColor:
                item === currentChain ? "var(--secondary)" : "null",
            }}
            onClick={() => {
              setCurrentChain(item);
              if (chainsID.has(item)) {
                switchNetwork?.(parseInt(chainsID.get(item) ?? ''))
              }
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
