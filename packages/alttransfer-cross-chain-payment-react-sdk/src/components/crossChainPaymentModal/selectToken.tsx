import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { useUserCurrencies } from "../../hooks/useUserToken";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";

export default function SelectToken({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { currencies, currenciesError, isLoadingCurrencies } =
    useUserCurrencies();
  console.log(currencies);
  if (isLoadingCurrencies) return <div>Loading...</div>;
  if (currenciesError) {
    console.error(currenciesError);
    return <div>Error loading user currencies</div>;
  }
  return (
    <>
      <div className="DialogHeading">
        <button
          className="IconButton"
          aria-label="Back"
          onClick={() => { setCurrentScreen(pages.HomeScreen); }}
        >
          <LeftIconButton />
        </button>
        <Dialog.Title className="DialogTitle">Select token</Dialog.Title>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <CrossIconButton />
          </button>
        </Dialog.Close>
      </div>
      <fieldset className="Fieldset">
        <input
          className="Input"
          id="name"
          placeholder="Search name or paste address"
        />
      </fieldset>
    </>
  );
}
