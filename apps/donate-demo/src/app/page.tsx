"use client";

import { AltTransferCrossChainPaymentModal } from "@alttransfer/cross-chain-payment-react-sdk";

export default function Page() {
  return (
    <div>
      <AltTransferCrossChainPaymentModal
        config={{
          ChainAPIs: {
            "0x1":
              "https://solemn-holy-layer.quiknode.pro/859bd0ec14bf3fa09445f2ceddbd9cef5c5f436c/",
            "0x89":
              "https://red-flashy-glade.matic.quiknode.pro/06e9538c594d0769ad9a0c3fd5ab4b883442619f/",
          },
          alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",
        }}
        getItemPrice={async () => {
          return Promise.resolve({
            amount: "10000000",
            chainId: "0x1",
            isNative: false,
            tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          });
        }}
        getRecipientAddress={async () => {
          return Promise.resolve({
            address: "0x123",
          });
        }}
        text={{
          brandName: "AltTransfer",
        }}
      >
        <button>Launch Me</button>
      </AltTransferCrossChainPaymentModal>
    </div>
  );
}
