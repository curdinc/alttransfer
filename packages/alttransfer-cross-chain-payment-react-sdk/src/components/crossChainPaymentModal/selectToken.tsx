import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { CrossIconButton, LeftIconButton } from "../../assets/iconButtons";
import { useUserCurrencies } from "../../hooks/useUserToken";
import { useCrossChainPayment } from "../CrossChainPaymentContext";
import { pages } from "../CrossChainPaymentModal";
import "./defaultmodal.css";

export default function SelectToken({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { currencies, currenciesError, isLoadingCurrencies } =
    useUserCurrencies();
  const [currencySearch, setCurrencySearch] = React.useState("");
  const [filteredCurrencies, setFilteredCurrencies] =
    React.useState(currencies);

  const { currency, setCurrency } = useCrossChainPayment();

  React.useEffect(() => {
    if (currencySearch === "") {
      setFilteredCurrencies(currencies);
    } else {
      setFilteredCurrencies(
        currencies.filter((currency) => {
          return (
            currency.name
              .toLowerCase()
              .includes(currencySearch.toLowerCase()) ||
            currency.symbol.toLowerCase().includes(currencySearch.toLowerCase())
          );
        })
      );
    }
  }, [currencySearch, currencies]);

  if (isLoadingCurrencies) {
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
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      </>
    );
  }
  if (currenciesError) {
    console.error(currenciesError);
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
      </>
    );
  }

  if (currencies.length === 0) {
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
          <Dialog.Title className="DialogTitle">Select token</Dialog.Title>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <CrossIconButton />
            </button>
          </Dialog.Close>
        </div>
        <div>No currencies found. Please top up some funds to continue.</div>
      </>
    );
  }

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
        <Dialog.Title className="DialogTitle">Select token</Dialog.Title>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <CrossIconButton />
          </button>
        </Dialog.Close>
      </div>
      <div>
        <fieldset className="Fieldset">
          <input
            className="Input"
            id="name"
            placeholder="Search name or paste address"
            value={currencySearch}
            onChange={(e) => {
              setCurrencySearch(e.target.value);
            }}
          />
        </fieldset>
        <div className="flex flex-col space-y-2 mt-3 hover:cursor-pointer">
          {filteredCurrencies.map((currency) => {
            return (
              <div
                className="flex justify-between hover:bg-gray-700 px-4 py-2"
                onClick={() => {
                  setCurrency(currency);
                  setCurrentScreen(pages.HomeScreen);
                }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                    <img src={currency.tokenUri} alt={currency.name} />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-lg">{currency.symbol}</div>
                    <div className="text-xs text-grey-200">{currency.name}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div>{currency.formattedBalance}</div>
                  <div className="text-xs">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(parseFloat(currency.balanceUsdValueCents))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
