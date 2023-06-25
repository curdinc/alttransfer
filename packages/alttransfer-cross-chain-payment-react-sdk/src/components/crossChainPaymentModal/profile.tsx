import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { useUserCurrencies } from "../../hooks/useUserToken";
import { pages } from "../CrossChainPaymentModal";
import "./defaultModal.css";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";
import NavBar from "../navBar";
import { useAccount } from "wagmi";
import { wallets } from "./modifyWallet";
import { formatEvmAddress } from "../../units/blockchain";
import { CopyIcon, ExternalLink, ExternalLinkIcon } from "lucide-react";

export default function Profile({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { connector: activeConnector, address } = useAccount();

  const size = "1.5em";
  const ExternalLinkIcon = () => {
    return <ExternalLink width={size} height={size} strokeWidth={2} />;
  };
  const CopyLinkIcon = () => {
    return <CopyIcon width={size} height={size} strokeWidth={2} />;
  };

  return (
    <>
      <NavBar backLink={pages.HomeScreen} title="Account" setCurrentScreen={setCurrentScreen} />
      <div className="splitText">

        {
          activeConnector && address
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', width: '100%' }}>
              <div className="splitText">
                <div style={{ display: "flex", alignItems: 'center', gap: '0.5em' }} className="tertiaryText">
                  Connected with {activeConnector.name} {wallets.get(activeConnector.name)}
                </div>
                <button className="HomepageSelectButton">
                  Change
                </button>
              </div>
              <div>
                {/* profile pic */}
                {/* address */}
                <div className="largeText">{formatEvmAddress(address.toString())}</div>
              </div>
              <div style={{ width: '100%' }} className="splitText tertiaryText">
                <a
                  className="ProfileLinks blue"
                  onClick={() => { window.open(`https://etherscan.io/address/${address}`) }}>
                  View on explore <ExternalLinkIcon />
                </a>
                <a
                  className="ProfileLinks gray"
                  onClick={() => { navigator.clipboard.writeText(address) }}
                >
                  Copy address <CopyLinkIcon />
                </a>
              </div>
            </div>
            : "Wallet not connected."
        }
      </div>
    </>
  );
}