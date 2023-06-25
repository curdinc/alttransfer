import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { useUserCurrencies } from "../../hooks/useUserToken";
import { pages } from "../CrossChainPaymentModal";
import "./defaultModal.css";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";
import NavBar from "../navBar";

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
      <NavBar backLink={pages.HomeScreen} title="Select token" setCurrentScreen={setCurrentScreen} />
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
