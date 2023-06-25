import { ADDRESS_SCANNER_URLS, LifiSwapDataReturnType, SupportedChainIds, SupportedChainIdsSchema, TXN_SCANNER_URLS, getSwaps } from "@alttransfer/cross-chain-payment-core";
import { CopyIcon, ExternalLink } from "lucide-react";
import React, { useEffect } from "react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { formatEvmAddress } from "../../units/blockchain";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";
import { wallets } from "./modifyWallet";

export default function Profile({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { connector: activeConnector, address } = useAccount();
  const { chain, chains } = useNetwork()
  const { disconnect } = useDisconnect()
  const [data, setData] = React.useState<LifiSwapDataReturnType>([]);
  const [chainId, setChainId] = React.useState<SupportedChainIds>("0x1");
  const size = "1.5em";
  const ExternalLinkIcon = () => {
    return <ExternalLink width={size} height={size} strokeWidth={2} />;
  };
  const CopyLinkIcon = () => {
    return <CopyIcon width={size} height={size} strokeWidth={2} />;
  };
  
  useEffect(() => { 
       if(chain != null) {
        const chainIdParsed = SupportedChainIdsSchema.safeParse(`0x${chain.id.toString(16)}`);
        if(chainIdParsed.success) {
          setChainId(chainIdParsed.data);
          if(address != null) {
              getSwaps(address, chainId).then((res) => {
                setData(res);
              })
         }
        }
    }
  }, [chain, address]);

  return (
    <>
      <NavBar
        backLink={pages.HomeScreen}
        title="Account"
        setCurrentScreen={setCurrentScreen}
      />
      <div className="splitText">
        {activeConnector && address ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1em",
              width: "100%",
              height: "100%"
            }}
          >
            <div className="splitText">
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5em" }}
                className="tertiaryText"
              >
                Connected with {activeConnector.name}{" "}
                {wallets.get(activeConnector.name)}
              </div>
              <button className="HomepageSelectButton" onClick={() => {disconnect(); setCurrentScreen(pages.HomeScreen)}}>Disconnect</button>
            </div>
            <div>
              {/* profile pic */}
              {/* address */}
              <div className="largeText">
                {formatEvmAddress(address.toString())}
              </div>
            </div>
            <div style={{ width: "100%" }} className="splitText tertiaryText">
              <a
                className="ProfileLinks blue"
                onClick={() => {
                  window.open(`${ADDRESS_SCANNER_URLS[chainId] + address}`);
                }}
              >
                View on explore <ExternalLinkIcon />
              </a>
              <a
                className="ProfileLinks gray"
                onClick={() => {
                  navigator.clipboard.writeText(address);
                }}
              >
                Copy address <CopyLinkIcon />
              </a>
            </div>
            <div className="overflow-auto h-32">
              <table className="table">
                <thead>
                  <tr className="flex justify-between  w-[320px] mb-2">
                    <th>Transaction Hash</th>
                    <th>Time stamp</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {[...data, ...data].map((item, index) => {
                    return (
                      <tr key={index} className="flex justify-between  w-[320px]">
                        <td><a className="hover:underline" target="_blank" href={TXN_SCANNER_URLS[chainId] + item.transactionHash}>{formatEvmAddress(item.transactionHash)}</a></td>
                        <td>{(new Date(parseInt(item.timestamp) * 1000)).toDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          "Wallet not connected."
        )}
      </div>
    </>
  );
}
