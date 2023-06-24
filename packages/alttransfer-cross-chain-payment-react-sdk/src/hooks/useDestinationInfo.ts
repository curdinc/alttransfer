import { useQuery } from "@tanstack/react-query";
import { useCrossChainPayment } from "../components/CrossChainPaymentContext";

export function useDestinationInfo() {
  const { sdk } = useCrossChainPayment();
  const {
    data: destinationInfo,
    isLoading: isLoadingDestinationInfo,
    error: destinationError,
  } = useQuery({
    queryKey: ["getDestinationInfo"],
    queryFn: async () => {
      const itemInfo = await sdk.getItemPriceInfo();
      const recipientInfo = await sdk.getDestinationAddress();
      return { itemInfo, recipientInfo };
    },
  });

  return {
    destinationInfo,
    isLoadingDestinationInfo,
    destinationError,
  };
}
