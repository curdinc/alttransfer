import { SupportedChainIdsSchema } from "@alttransfer/cross-chain-payment-core";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useCrossChainPayment } from "../components/CrossChainPaymentContext";

export function useUserCurrencies() {
  const { sdk } = useCrossChainPayment();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const {
    data,
    isLoading: isLoadingCurrencies,
    error: currenciesError,
  } = useQuery({
    queryKey: ["getUserTokenInfo", chain?.id, address],
    queryFn: async () => {
      if (!chain?.id || !address) return;
      const currencies = await sdk.getUsableCurrencies({
        chainId: SupportedChainIdsSchema.parse(
          `0x${chain?.id.toString(16)}` ?? "0x1"
        ),
        address,
      });
      return currencies;
    },
    enabled: !!chain && !!address,
  });

  const currencies = useMemo(() => {
    return data ?? [];
  }, [data]);

  return {
    currencies: currencies,
    isLoadingCurrencies,
    currenciesError,
  };
}
