import type { AltTransferCrossChainSdkConstructorArgs } from "@alttransfer/cross-chain-payment-core";
import * as Dialog from "@radix-ui/react-dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useDestinationInfo } from "../hooks/useDestinationInfo";
import { CrossChainPaymentProvider } from "./CrossChainPaymentContext";
import ConfirmPayment from "./crossChainPaymentModal/confirmPayment";
import "./crossChainPaymentModal/defaultModal.css";
import HomePage from "./crossChainPaymentModal/homepage";
import ModifyWallet from "./crossChainPaymentModal/modifyWallet";
import Profile from "./crossChainPaymentModal/profile";
import SelectChain from "./crossChainPaymentModal/selectChain";
import SelectToken from "./crossChainPaymentModal/selectToken";
import SubmittedPayment from "./crossChainPaymentModal/submittedPayment";

const queryClient = new QueryClient();

export enum pages {
  HomeScreen = "homeScreen",
  SelectToken = "selectToken",
  SelectChain = "selectChain",
  ModifyWallet = "modifyWallet",
  ConfirmPayment = "confirmPayment",
  SubmittedPayment = "paymentSubmit",
  Profile = "profile",
}

export type constInfoType =
  | {
      curToken: string;
      curCostInToken: string;
      curCostInUSDC: string;
      rate: string;
      bal: string;
      cost: string;
    }
  | Record<string, never>;

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
        text={props.text}
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
  const [costInfo, setCostInfo] = React.useState({});

  React.useEffect(() => {
    // Replace this
    const randomCostInfo = {
      curToken: "BTC",
      curCostInToken: "0.353",
      curCostInUSDC: "6339.2",
      rate: "-0.5%",
      bal: "0",
      cost: "123",
    };
    setCostInfo(randomCostInfo);
  }, []);

  const renderPage = () => {
    switch (currentScreen) {
      case pages.HomeScreen:
        return (
          <HomePage setCurrentScreen={setCurrentScreen} costInfo={costInfo} />
        );
      case pages.SelectToken:
        return <SelectToken setCurrentScreen={setCurrentScreen} />;
      case pages.ModifyWallet:
        return <ModifyWallet setCurrentScreen={setCurrentScreen} />;
      case pages.SelectChain:
        return <SelectChain setCurrentScreen={setCurrentScreen} />;
      case pages.ConfirmPayment:
        return (
          <ConfirmPayment
            setCurrentScreen={setCurrentScreen}
            costInfo={costInfo}
          />
        );
      case pages.SubmittedPayment:
        return <SubmittedPayment setCurrentScreen={setCurrentScreen} />;
      case pages.Profile:
        return <Profile setCurrentScreen={setCurrentScreen} />;
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
    <Dialog.Root
      onOpenChange={() => {
        setCurrentScreen(pages.HomeScreen);
      }}
    >
      <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />

        <Dialog.Content className="DialogContent">
          {renderPage()}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
