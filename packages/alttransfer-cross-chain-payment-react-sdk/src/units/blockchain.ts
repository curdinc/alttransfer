import { TokenInfo } from "@alttransfer/cross-chain-payment-core";
import { formatUnits, parseUnits } from "viem";
import { truncateBalance } from "./formatCurrency";

export function formatEvmAddress(value: string) {
  return value.substring(0, 5) + "..." + value.substring(value.length - 4);
}

export function getCurrencyToBePaid(currency: TokenInfo, itemInfo?: TokenInfo) {
  const balanceToBePaid = truncateBalance(
    formatUnits(
      (parseUnits(itemInfo?.balanceUsdValueCents || "0", 18) *
        parseUnits(currency.balance, currency.decimals)) /
        parseUnits(
          currency.balanceUsdValueCents === "0"
            ? "1"
            : currency.balanceUsdValueCents,
          currency.decimals
        ),
      18 + currency.decimals
    )
  );
  return balanceToBePaid;
}
