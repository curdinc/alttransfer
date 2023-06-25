

import * as Dialog from "@radix-ui/react-dialog";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { LeftIconButton, ProfileEmptyIcon } from "../assets/iconButtons";
import { pages } from "./CrossChainPaymentModal";


export default function NavBar({ setCurrentScreen, backLink, title, NavRight }:
  { setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>, backLink?: pages, title: string, NavRight?: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const ensName = useEnsName({
      address: address,
    })
    const ensAvatar = useEnsAvatar({
        name: ensName.data,
    })
  return (
    <div className="DialogHeading">
      {
        backLink ? <button
          className="IconButton"
          aria-label="Back"
          onClick={() => {
            setCurrentScreen(backLink);
          }}
        >
          <LeftIconButton />
        </button> : <div className="IconButton" style={{ opacity: 0 }} />
      }
      <Dialog.Title className="DialogTitle">{title}</Dialog.Title>
      {NavRight ? NavRight :
        <div onClick={() => setCurrentScreen(pages.Profile)}>
          {
            ensAvatar.data?
              <img
                className="h-6 w-6 rounded-full image-cover"
                src={ensAvatar.data??""}
              />
             : 
            <ProfileEmptyIcon />
          }
        </div>
      }
    </div>
  )
}