import * as Dialog from "@radix-ui/react-dialog";
import { Circle } from "lucide-react";
import { useConnect } from "wagmi";
import { Coinbase, MetaMask, WalletConnect } from "../../assets/icons-wallets";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";
import { pages } from "../CrossChainPaymentModal";
import "./defaultModal.css";
import NavBar from "../navBar";


export const wallets = new Map<string, JSX.Element>([
  ["MetaMask", <MetaMask />],
  ["Coinbase Wallet", <Coinbase />],
  ["WalletConnect", <WalletConnect />],
]);



export default function ModifyWallet({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  return (
    <>
      <NavBar backLink={pages.HomeScreen} title="Select a wallet" setCurrentScreen={setCurrentScreen} />
      {connectors.map((connector) => (
        <button
          className="ModifyWalletButton"
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => {
            connect({ connector });
            setCurrentScreen(pages.HomeScreen);
          }}
        >
          <div>
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </div>
          {
            wallets.has(connector.name) ? wallets.get(connector.name) : <Circle width={32} height={32} />
          }
        </button>
      ))}

      {/* {wallets.map((item) => {
        return (
          <button className="ModifyWalletButton" key={item.title}>
            <div>{item.title}</div>
            {item.icon}
          </button>
        );
      })} */}
    </>
  );
}
