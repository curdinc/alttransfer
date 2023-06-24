import type { AltTransferCrossChainSdkConstructorArgs } from "@alttransfer/cross-chain-payment-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useDestinationInfo } from "../hooks/useDestinationInfo";
import { CrossChainPaymentProvider } from "./CrossChainPaymentContext";

const queryClient = new QueryClient();

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
        <PaymentModal>{props.children}</PaymentModal>
      </CrossChainPaymentProvider>
    </QueryClientProvider>
  );
}

function PaymentModal({ children }: { children: React.ReactNode }) {
  const { isLoadingDestinationInfo, destinationInfo, destinationError } =
    useDestinationInfo();

  console.log("destinationInfo", destinationInfo);
  console.log("isLoadingDestinationInfo", isLoadingDestinationInfo);

  if (destinationError) {
    console.error(destinationError);
    return <div>Something went wrong fetching payment information</div>;
  }

  return <div>{children}</div>;
}
