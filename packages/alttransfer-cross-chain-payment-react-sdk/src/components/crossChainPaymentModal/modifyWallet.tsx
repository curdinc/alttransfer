import * as Dialog from "@radix-ui/react-dialog";
import { Circle } from "lucide-react";
import { useConnect } from "wagmi";
import { Coinbase, MetaMask, WalletConnect } from "../../assets/icons-wallets";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";


let randomShit = new Map<string, JSX.Element>([
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
      <div className="DialogHeading">
        <button
          className="IconButton"
          aria-label="Back"
          onClick={() => {
            setCurrentScreen(pages.HomeScreen);
          }}
        >
          <LeftIconButton />
        </button>
        <Dialog.Title className="DialogTitle">
          Select a wallet
        </Dialog.Title>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <CrossIconButton />
          </button>
        </Dialog.Close>
      </div>
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
            randomShit.has(connector.name) ? randomShit.get(connector.name) : <Circle width={32} height={32} />
          }
        </button>
      ))}

      {/* {randomShit.map((item) => {
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
