# AltTransfer

## Cross Chain Payments React SDK

<div>
  <a href="https://www.npmjs.com/package/@alttransfer/cross-chain-payment-react-sdk"><img src="https://img.shields.io/npm/v/@alttransfer/cross-chain-payment-react-sdk.svg?style=flat&color=white" target="_blank" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-black" /></a>
</div>
This package enables you to seamlessly accept payment from your user from any chain within your dApp

To get started, install the SDK

```bash
npm install @alttransfer/cross-chain-payment-react-sdk wagmi@1.2.1 viem@1.1.6
```

Once installed, we now configure wagmi for react. Refer to [wagmi docs](https://wagmi.sh/react/getting-started) for more information on the various settings

```typescript
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export function App() {
  const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, ...(process.env.NODE_ENV === "development" ? [goerli] : [])],
    [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
      publicProvider(),
    ]
  );

  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "wagmi",
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: walletConnectProjectId,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  });
  return (
    <WagmiConfig config={config}>
      <YourApp />
    </WagmiConfig>
  );
}
```

Now, you can simply use the payment component anywhere in your app where you want to receive payment.

```typescript
type SupportedChainIds = '0x89' | '0xa' | '0xa4b1' | '0xa86a' | '0x1'

<AltTransferCrossChainPayment
    async getItemPrice(): Promise<{
            isNative: true,
            amount: string,
            chainId: SupportedChainIds
        } | {
            isNative: false,
            tokenAddress: string,
            amount: string
            chainId: SupportedChainIds
        }>{
        // you can fetch the price from your backend if needed here.
        return  {
            isNative: false,
            tokenAddress: '0x123456789...',
            // amount is in the currency's base units
            amount: '12000000000'
        }
    }
    async getRecipientAddress(): Promise<{address: string}> {
        // you can fetch the address you want the token or coin to be sent too.
        return '0x123456789...'
    }
    optimisticSettlement={false}
    config={{
      ChainAPIs: {
        "0x1": "",
        "0x89": "",
      },
      alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",
    }}
/>
```

Note: `QuickNodeApiKey` is needed to display an accurate Token balance available for the users to choose.

With that, user's will experience the following flow:

<!-- TODO: Insert GIF here -->

It's that easy.

### FAQ

#### Why are the users cross chain payment taking so long?

While cross chain is great, it comes with an inherent drawback of risk. Due to the nature of the chains, it is possible for re-orgs to happen. When that happens, transactions that were previously confirmed can become invalidated. Hence, a certain amount of time is needed before we can be sure that the funds have settled.

Note that it is possible to optimistically push the users funds through simply by passing `optimisticSettlement={true}` in the SDK

#### Users are already connected to my dApp, how can I not have my users connect their wallet again?

At this point, the only way to do that is if you use `wagmi` under the hood to power your wallet connection as well.

The good news is that many of the popular wallet connection libraries (connectkit, rainbowkit etc.) all use wagmi under the hood! So your users should have a seamless payment experience out of the box.

## Cross Chain Payment core JS SDK

If you don't use react and still want the benefit of allowing your users to easily pay you via cross chain methods, then the JS SDK would be the right solution.

To get started, install the SDK

```bash
npm install @alttransfer/cross-chain-payment-core @wagmi/core@1.2.1 viem@1.1.6
```

Once installed, we now configure wagmi core. Refer to [wagmi docs](https://wagmi.sh/core/getting-started) for more information on the various settings

```typescript
import { configureChains, createConfig } from "@wagmi/core";
import { goerli, mainnet } from "@wagmi/core/chains";
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";

import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { publicProvider } from "@wagmi/core/providers/public";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, ...(process.env.NODE_ENV === "development" ? [goerli] : [])],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: walletConnectProjectId,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});
```

Now, you can simply use the payment component anywhere in your app where you want to receive payment.

```typescript
const sdk = AltTransferCrossChainPaymentSdk({
  async getItemPrice(): Promise<{
          isNative: true,
          amount: string,
          chainId: SupportedChainIds
      } | {
          isNative: false,
          tokenAddress: string,
          amount: string
          chainId: SupportedChainIds
      }>{
      // you can fetch the price from your backend if needed here.
      return  {
          isNative: false,
          tokenAddress: '0x123456789...',
          // amount is in the currency's base units
          amount: '12000000000'
      }
  }
  async getRecipientAddress(): Promise<{address: string}> {
      // you can fetch the address you want the token or coin to be sent too.
      return '0x123456789...'
  }

  optimisticSettlement={false}
    config={{
      // Needed to display an accurate Token balance available for the users to choose.
      ChainAPIs: {
        "0x1": "",
        "0x89": "",
      },
      alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",
    }}
})

// this will return a list of tokens that the user can use to pay for the transaction.
type TokenInfo = {
  address: string,
  decimals: number,
  name: string,
  symbol: string,
  balance: string,
  tokenUri?: string,
  chainId: SupportedChainIds,
  balanceUsdValueCents: string,
  tokenExchangeUsdValueCents: string,
}
const userTokensAndCoin : TokenInfo[] = await sdk.getUserUsableCurrencies(chainId as SupportedChainIds);


const receipt = await sdk.pay({
  walletClient: WalletClient,
  currency: TokenInfo,
  optimisticSettlement: false,
})
```

## Local development

Clone the repo and run the following command

```bash
pnpm i && pnpm build-packages
pnpm dev
```
