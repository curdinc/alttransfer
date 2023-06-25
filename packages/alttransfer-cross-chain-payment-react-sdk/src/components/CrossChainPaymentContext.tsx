import {
  AltTransferCrossChainSdk,
  TokenInfo,
} from "@alttransfer/cross-chain-payment-core";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import type { AltTransferCrossChainPaymentModalProps } from "./CrossChainPaymentModal";
import { ChainsDataType, chainsID } from "./crossChainPaymentModal/chains-data";

export const defaultCurrency: TokenInfo = {
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
  currentChain: ChainsDataType;
  setCurrentChain: React.Dispatch<React.SetStateAction<ChainsDataType>>;
  txnLink?: string;
  setTxnLink: React.Dispatch<React.SetStateAction<string>>;
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
        amount: "0",
      });
    },
    getRecipientAddress: async () => {
      return await Promise.resolve({
        address: "",
      });
    },
    text: {
      brandName: "Your Brand name",
    },
  }),
  currency: defaultCurrency,
  setCurrency: () => {},
  currentChain: "Ethereum",
  setCurrentChain: () => {},
  setTxnLink: () => {},
});
export function CrossChainPaymentProvider({
  children,
  config,
  getItemPrice,
  getRecipientAddress,
  text,
}: AltTransferCrossChainPaymentModalProps) {
  const [currency, setCurrency] = useState<TokenInfo>(defaultCurrency);
  const [currentChain, setCurrentChain] = useState<ChainsDataType>("Chain");
  const [txnLink, setTxnLink] = useState<string>("");

  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (isConnected && chainsID.has(chain?.name ?? "")) {
      setCurrentChain((chain?.name as any) ?? "Chain");
    } else {
      setCurrentChain("Chain");
    }
  }, [isConnected]);

  const sdk = new AltTransferCrossChainSdk({
    config,
    getItemPrice,
    getRecipientAddress,
    text,
  });
  return (
    <CrossChainContext.Provider
      value={{
        sdk,
        currency,
        setCurrency,
        currentChain,
        setCurrentChain,
        txnLink,
        setTxnLink,
      }}
    >
      {children}
    </CrossChainContext.Provider>
  );
}

export const useCrossChainPayment = () => {
  return useContext(CrossChainContext);
};
