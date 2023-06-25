import { configureChains, createConfig } from 'wagmi';
import {
  arbitrum,
  gnosis,
  goerli,
  mainnet,
  optimism,
  polygon
} from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

if (
  !process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
) {
  throw new Error(
    'Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID or NEXT_PUBLIC_ALCHEMY_API_KEY'
  );
}

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    arbitrum,
    optimism,
    polygon,
    gnosis,
    ...(process.env.NODE_ENV === 'development' ? [goerli] : [])
  ],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider()
  ]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi'
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: walletConnectProjectId
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          }`,
        shimDisconnect: true
      }
    })
  ],
  publicClient,
  webSocketPublicClient
});
