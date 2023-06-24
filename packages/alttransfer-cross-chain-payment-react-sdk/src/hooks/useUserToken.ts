import { SupportedChainIdsSchema } from "@alttransfer/cross-chain-payment-core";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useNetwork } from "wagmi";
import { useCrossChainPayment } from "../components/CrossChainPaymentContext";

export function useUserCurrencies() {
  const { sdk } = useCrossChainPayment();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const {
    data: currencies,
    isLoading: isLoadingCurrencies,
    error: currenciesError,
  } = useQuery({
    queryKey: ["getUserTokenInfo", chain?.id, address],
    queryFn: async () => {
      // if (!chain?.id || !address) return;

      const currencies = await sdk.getUsableCurrencies({
        chainId: SupportedChainIdsSchema.parse(chain?.id ?? "0x1"),
        address: "0xb3E9C57fB983491416a0C77b07629C0991c3FD59",
      });
      return { currencies };
    },
    // enabled: !!chain && !!address,
  });

  return {
    currencies,
    isLoadingCurrencies,
    currenciesError,
  };
}
