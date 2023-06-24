# AltTransfer

## Cross Chain Payments

This package enables you to seamlessly accept payment from your user from any chain within your dApp

To get started, install the SDK

```bash
npm install @alttransfer/cross-chain-payment-js-sdk @alttransfer/cross-chain-payment-react-sdk wagmi@1.2.1 viem@1.1.6
```

Once installed, we now configure wagmi for react. Refer to [wagmi docs](https://wagmi.sh/react/getting-started) for more information on the various settings

```typescript
import { WagmiConfig } from "wagmi";

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
            price: string,
            chainId: SupportedChainIds
        } | {
            isNative: false,
            tokenAddress: string,
            price: string
            chainId: SupportedChainIds
        }>{
        // you can fetch the price from your backend if needed here.
        return  {
            isNative: false,
            tokenAddress: '0x123456789...',
            // price is in the currency's base units
            price: '12000000000'
        }
    }
    async getRecipientAddress(): Promise<{address: string}> {
        // you can fetch the address you want the token or coin to be sent too.
        return '0x123456789...'
    }
    optimisticSettlement={false}
/>
```

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
