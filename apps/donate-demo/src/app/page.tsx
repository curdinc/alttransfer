"use client";

import { AltTransferCrossChainPaymentModal } from "@alttransfer/cross-chain-payment-react-sdk";

export default function Page() {
  return (
    <div>
      <AltTransferCrossChainPaymentModal
        config={{
          quickNodeApiKey: "",
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
