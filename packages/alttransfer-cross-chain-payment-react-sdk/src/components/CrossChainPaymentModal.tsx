import type { AltTransferCrossChainSdkConstructorArgs } from "@alttransfer/cross-chain-payment-core";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import * as React from "react";
import {
  CrossChainPaymentProvider,
  useCrossChainPayment,
} from "./CrossChainPaymentContext";

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
  const { sdk } = useCrossChainPayment();
  const {
    data: destinationInfo,
    isLoading: isLoadingDestinationInfo,
    error: destinationError,
  } = useQuery({
    queryKey: ["getDestinationInfo"],
    queryFn: async () => {
      const itemInfo = await sdk.getItemPriceInfo();
      const recipientInfo = await sdk.getDestinationAddress();
      return { itemInfo, recipientInfo };
    },
  });

  console.log("destinationInfo", destinationInfo);

  if (destinationError) {
    console.error(destinationError);
    return <div>Something went wrong fetching </div>;
  }

  return <div>{children}</div>;
}
