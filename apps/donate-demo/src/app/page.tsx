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
            amount: "100000",
            chainId: "0xa",
            isNative: false,
            tokenAddress: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
          });
        }}
        getRecipientAddress={async () => {
          return Promise.resolve({
            address: "0xb3E9C57fB983491416a0C77b07629C0991c3FD59",
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
