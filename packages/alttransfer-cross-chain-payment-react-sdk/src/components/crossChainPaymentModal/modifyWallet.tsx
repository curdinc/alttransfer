import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Coinbase, MetaMask, WalletConnect } from "../../assets/icons-wallets";
import { CrossIconButton, LeftIconButton } from "./iconButtons";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";
import { Circle } from "lucide-react";

const randomShit = [
  { title: "Metamask", icon: <MetaMask /> },
  { title: "Coinbase Wallet", icon: <Coinbase /> },
  {
    title: "WalletConnect",
    icon: <WalletConnect />,
  },
  {
    title: "Other wallets",
    icon: <Circle width={32} height={32} />,
  },
];

export default function ModifyWallet({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  return (
    <>
      <div className="DialogHeading">
        <button
          className="IconButton"
          aria-label="Back"
          onClick={() => {
            setCurrentScreen(pages.HomeScreen);
          }}
        >
          <LeftIconButton />
        </button>
        <Dialog.Title className="DialogTitle">
          Select a paying wallet
        </Dialog.Title>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <CrossIconButton />
          </button>
        </Dialog.Close>
      </div>
      {randomShit.map((item) => {
        return (
          <button className="ModifyWalletButton" key={item.title}>
            <div>{item.title}</div>
            {item.icon}
          </button>
        );
      })}
    </>
  );
}
