

import * as Dialog from "@radix-ui/react-dialog";
import { pages } from "./CrossChainPaymentModal";
import { LeftIconButton, ProfileEmptyIcon } from "../assets/iconButtons";
export default function NavBar({ setCurrentScreen, backLink, title, NavRight }:
  { setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>, backLink?: pages, title: string, NavRight?: React.ReactNode }) {
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
          <ProfileEmptyIcon />
        </div>
      }
    </div>
  )
}