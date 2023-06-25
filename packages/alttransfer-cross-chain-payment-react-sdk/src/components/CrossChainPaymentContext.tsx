import {
  AltTransferCrossChainSdk,
  TokenInfo,
} from "@alttransfer/cross-chain-payment-core";
import { createContext, useContext, useState } from "react";
import type { AltTransferCrossChainPaymentModalProps } from "./CrossChainPaymentModal";

const defaultCurrency: TokenInfo = {
  address: "",
  chainId: "0x89",
  decimals: 0,
  tokenUri: "",
  name: "",
  symbol: "",
  balance: "0",
  balanceUsdValueCents: "0",
  formattedBalance: "0",
  tokenExchangeUsdValueCents: "0",
};

const CrossChainContext = createContext<{
  sdk: AltTransferCrossChainSdk;
  currency: TokenInfo;
  setCurrency: React.Dispatch<React.SetStateAction<TokenInfo>>;
}>({
  sdk: new AltTransferCrossChainSdk({
    config: {
      alchemyApiKey: "",
      ChainAPIs: {
        "0x1": "",
        "0x89": "",
      },
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
  currency: defaultCurrency,
  setCurrency: () => {},
});
export function CrossChainPaymentProvider({
  children,
  config,
  getItemPrice,
  getRecipientAddress,
}: AltTransferCrossChainPaymentModalProps) {
  const [currency, setCurrency] = useState<TokenInfo>(defaultCurrency);
  const sdk = new AltTransferCrossChainSdk({
    config,
    getItemPrice,
    getRecipientAddress,
  });
  return (
    <CrossChainContext.Provider
      value={{
        sdk,
        currency,
        setCurrency,
      }}
    >
      {children}
    </CrossChainContext.Provider>
  );
}

export const useCrossChainPayment = () => {
  return useContext(CrossChainContext);
};
