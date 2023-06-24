import type { AltTransferCrossChainSdkConstructorArgs } from "@alttransfer/cross-chain-payment-core";
import * as Dialog from "@radix-ui/react-dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useDestinationInfo } from "../hooks/useDestinationInfo";
import {
  CrossChainPaymentProvider,
  useCrossChainPayment,
} from "./CrossChainPaymentContext";
import "./crossChainPaymentModal/defaultModal.css";
import HomePage from "./crossChainPaymentModal/homepage";
import ModifyWallet from "./crossChainPaymentModal/modifyWallet";
import SelectChain from "./crossChainPaymentModal/selectChain";
import SelectToken from "./crossChainPaymentModal/selectToken";

const queryClient = new QueryClient();

export enum pages {
  HomeScreen = "homeScreen",
  SelectToken = "selectToken",
  SelectChain = "selectChain",
  ModifyWallet = "modifyWallet",
  ConfirmPayment = "confirmPayment",
  PaymentSubmit = "paymentSubmit",
}
export type AltTransferCrossChainPaymentModalProps = {
  children: React.ReactNode;
} & AltTransferCrossChainSdkConstructorArgs;

export function AltTransferCrossChainPaymentModal(
  props: AltTransferCrossChainPaymentModalProps
) {
  return (
    <QueryClientProvider client={queryClient}>
      <CrossChainPaymentProvider
        config={props.config}
        getItemPrice={props.getItemPrice}
        getRecipientAddress={props.getRecipientAddress}
      >
        <PaymentModal transferAmount="123">{props.children}</PaymentModal>
      </CrossChainPaymentProvider>
    </QueryClientProvider>
  );
}

interface modalProps {
  children: React.ReactNode;
  transferAmount: string;
}

const PaymentModal: React.FC<modalProps> = (props) => {
  const { isLoadingDestinationInfo, destinationInfo, destinationError } =
    useDestinationInfo();
  const [currentScreen, setCurrentScreen] = React.useState(pages.HomeScreen);
  const [curChain, setCurChain] = React.useState("Fantom");

  const { sdk } = useCrossChainPayment();
  sdk
    .getUsableCurrencies({
      address: "0xb1f8e55c7f64d203c1400b9d8555d050f94adf39",
      chainId: "0xa4b1",
    })
    .catch((e) => {
      console.log("error getting usable currency", e);
    });

  const renderPage = () => {
    switch (currentScreen) {
      case pages.HomeScreen:
        return (
          <HomePage setCurrentScreen={setCurrentScreen} curChain={curChain} />
        );
      case pages.SelectToken:
        return <SelectToken setCurrentScreen={setCurrentScreen} />;
      case pages.ModifyWallet:
        return <ModifyWallet setCurrentScreen={setCurrentScreen} />;
      case pages.SelectChain:
        return (
          <SelectChain
            setCurrentScreen={setCurrentScreen}
            currentChain={curChain}
            setCurrentChain={setCurChain}
          />
        );
      default:
        <div></div>;
    }
  };

  console.log("destinationInfo", destinationInfo);
  console.log("isLoadingDestinationInfo", isLoadingDestinationInfo);

  if (destinationError) {
    console.error(destinationError);
    return <div>Something went wrong fetching payment information</div>;
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        {renderPage()}
      </Dialog.Portal>
    </Dialog.Root>
  );
};
