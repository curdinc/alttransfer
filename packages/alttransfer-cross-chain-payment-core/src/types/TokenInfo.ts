import type { SupportedChainIds } from "./SupportedChainIds";

export type TokenInfo = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  balance: string;
  tokenUri?: string;
  chainId: SupportedChainIds;
  balanceUsdValueCents: string;
  tokenExchangeUsdValueCents: string;
};
