import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import type {
  SwapOptionsSwapRouter02,
  SwapRoute,
} from "@uniswap/smart-order-router";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import { ethers } from "ethers";
import type { SupportedChainIds } from "../../types/SupportedChainIds";
import type { TokenInfo } from "../../types/TokenInfo";

export const USDC_ADDRESSES: Record<SupportedChainIds, string> = {
  "0x1": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0x89": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  "0xa": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0xa4b1": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
};

/**
 *
 * @param fromToken The token we want to get a quote for.
 * @param toToken The token we want the quote to be priced in. Defaults to USDC.
 *
 */
export async function getQuote({
  fromToken,
  toToken,
  hexChainId,
  userAddress,
}: {
  fromToken: TokenInfo;
  toToken?: TokenInfo;
  hexChainId: SupportedChainIds;
  userAddress: string;
}) {
  const route = await generateRoute({
    fromToken,
    toToken: toToken ?? {
      address: USDC_ADDRESSES[hexChainId],
      decimals: 6,
      name: "USDC",
      symbol: "USDC",
      chainId: hexChainId,
      balance: "",
      balanceUsdValueCents: "",
      tokenExchangeUsdValueCents: "100",
    },
    toAmount: "1000000",
    hexChainId: hexChainId,
    userAddress,
  });
  console.log("route", route);
}

export async function generateRoute({
  fromToken,
  toToken,
  toAmount,
  hexChainId,
  userAddress,
}: {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  toAmount: string;
  hexChainId: SupportedChainIds;
  userAddress: string;
}): Promise<SwapRoute | null> {
  const router = new AlphaRouter({
    chainId: parseInt(hexChainId),
    provider: new ethers.providers.JsonRpcProvider(""),
  });

  const options: SwapOptionsSwapRouter02 = {
    recipient: userAddress,
    slippageTolerance: new Percent(5, 1_000), //0.5%
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  };

  const route = await router.route(
    CurrencyAmount.fromRawAmount(
      new Token(
        parseInt(hexChainId),
        toToken.address,
        toToken.decimals,
        toToken.symbol,
        toToken.name
      ),
      toAmount
    ),
    new Token(
      parseInt(hexChainId),
      fromToken.address,
      fromToken.decimals,
      fromToken.symbol,
      fromToken.name
    ),
    TradeType.EXACT_OUTPUT,
    options
  );

  return route;
}
