"use client";

import { AltTransferCrossChainPaymentModal } from "@alttransfer/cross-chain-payment-react-sdk";
export default function Page() {
  return (
    <div>
      <AltTransferCrossChainPaymentModal
        config={{
          ChainAPIs: {
            "0x1": "https://solemn-holy-layer.quiknode.pro/859bd0ec14bf3fa09445f2ceddbd9cef5c5f436c/",
            "0x89": "",
            "0xa": "",
            "0xa4b1": ""
          }
        }}
        getItemPrice={async () => {
          return Promise.resolve({
            price: "100000",
            chainId: "0x1",
            isNative: true,
          });
        }}
        getRecipientAddress={async () => {
          return Promise.resolve({
            address: "0x123",
          });
        }}
      >
        <button>Launch Me</button>
      </AltTransferCrossChainPaymentModal>
    </div>
  );
}
