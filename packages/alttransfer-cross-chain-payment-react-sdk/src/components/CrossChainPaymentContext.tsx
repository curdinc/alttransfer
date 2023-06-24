import { AltTransferCrossChainSdk } from "@alttransfer/cross-chain-payment-core";
import { createContext, useContext } from "react";
import type { AltTransferCrossChainPaymentModalProps } from "./CrossChainPaymentModal";

const CrossChainContext = createContext<{
  sdk: AltTransferCrossChainSdk;
}>({
  sdk: new AltTransferCrossChainSdk({
    config: {
      quickNodeApiKey: "",
    },
    getItemPrice: async () => {
      return await Promise.resolve({
        chainId: "0x1",
        isNative: true,
        price: "0",
      });
    },
    getRecipientAddress: async () => {
      return await Promise.resolve({
        address: "",
      });
    },
  }),
});
export function CrossChainPaymentProvider({
  children,
  config,
  getItemPrice,
  getRecipientAddress,
}: AltTransferCrossChainPaymentModalProps) {
  const sdk = new AltTransferCrossChainSdk({
    config,
    getItemPrice,
    getRecipientAddress,
  });
  return (
    <CrossChainContext.Provider
      value={{
        sdk,
      }}
    >
      {children}
    </CrossChainContext.Provider>
  );
}

export const useCrossChainPayment = () => {
  return useContext(CrossChainContext);
};
