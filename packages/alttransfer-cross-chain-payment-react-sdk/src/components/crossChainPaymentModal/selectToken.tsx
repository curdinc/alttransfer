import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { useUserCurrencies } from "../../hooks/useUserToken";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";
import { CrossIconButton, LeftIconButton } from "./iconButtons";

export default function SelectToken({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { currencies, currenciesError, isLoadingCurrencies } =
    useUserCurrencies();
  console.log("currencies", currencies);
  if (isLoadingCurrencies) {
    return (
      <Dialog.Content className="DialogContent">
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
          <Dialog.Title className="DialogTitle">Select token</Dialog.Title>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <CrossIconButton />
            </button>
          </Dialog.Close>
        </div>
        <div
          style={{
            color: "white",
          }}
        >
          Loading...
        </div>
      </Dialog.Content>
    );
  }
  if (currenciesError) {
    console.error(currenciesError);
    return (
      <Dialog.Content className="DialogContent">
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
          <Dialog.Title className="DialogTitle">Select token</Dialog.Title>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <CrossIconButton />
            </button>
          </Dialog.Close>
        </div>
        <div
          style={{
            color: "white",
          }}
        >
          Error loading user currencies
        </div>
      </Dialog.Content>
    );
  }
  return (
    <Dialog.Content className="DialogContent">
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
    </Dialog.Content>
  );
}
