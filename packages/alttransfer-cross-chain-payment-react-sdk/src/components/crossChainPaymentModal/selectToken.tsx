import React, { useState } from "react";
import { useUserCurrencies } from "../../hooks/useUserToken";
import { useCrossChainPayment } from "../CrossChainPaymentContext";
import { pages } from "../CrossChainPaymentModal";
import NavBar from "../navBar";

export default function SelectToken({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<pages>>;
}) {
  const { currencies, currenciesError, isLoadingCurrencies } =
    useUserCurrencies();
  const [currencySearch, setCurrencySearch] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);

  const { setCurrency } = useCrossChainPayment();

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
        <NavBar
          backLink={pages.HomeScreen}
          title="Select token"
          setCurrentScreen={setCurrentScreen}
        />

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
        <NavBar
          backLink={pages.HomeScreen}
          title="Select token"
          setCurrentScreen={setCurrentScreen}
        />

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
        <NavBar
          backLink={pages.HomeScreen}
          title="Select token"
          setCurrentScreen={setCurrentScreen}
        />

        <div>No currencies found. Please top up some funds to continue.</div>
      </>
    );
  }

  return (
    <>
      <NavBar
        backLink={pages.HomeScreen}
        title="Select token"
        setCurrentScreen={setCurrentScreen}
      />
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
        <div className="flex flex-col space-y-2 mt-3 h-[300px] overflow-auto hover:cursor-pointer">
          {filteredCurrencies.map((currency) => {
            return (
              <div
                key={currency.address}
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
