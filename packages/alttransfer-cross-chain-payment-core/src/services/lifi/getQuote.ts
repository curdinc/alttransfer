import { LiFi } from "@lifi/sdk";
import { formatUnits, parseUnits } from "viem";
import { USDC_ADDRESSES } from "../../constants/USDC";
import { SupportedChainIds } from "../../types/SupportedChainIds";
import { TokenInfo } from "../../types/TokenInfo";

/**
 *
 * @param fromToken The token we want to get a quote for.
 * @param toToken The token we want the quote to be priced in. Defaults to USDC.
 *
 */
export async function getLiFiQuote({
  fromToken,
  fromAmount,
  toToken,
  hexChainId,
}: {
  fromToken: TokenInfo;
  fromAmount: string;
  toToken?: TokenInfo;
  hexChainId: SupportedChainIds;
}) {
  const targetToken = toToken ?? {
    address: USDC_ADDRESSES[hexChainId],
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
    chainId: hexChainId,
  };

  const lifi = new LiFi({
    integrator: "",
  });
  const { tokens } = await lifi.getTokens({
    chains: [parseInt(fromToken.chainId)],
  });
  const balances = await lifi.getTokenBalances(
    "0xb3E9C57fB983491416a0C77b07629C0991c3FD59",
    tokens[parseInt(fromToken.chainId)]
  );
  console.log("balances", balances);
  const route = await lifi.getRoutes({
    fromAmount,
    fromChainId: parseInt(fromToken.chainId),
    fromTokenAddress: fromToken.address,
    toChainId: parseInt(toToken?.chainId ?? hexChainId),
    toTokenAddress: targetToken.address,
  });
  console.log("route", route);
}

export async function getTokens(userAddress: string, chainId: string) {
  const lifi = new LiFi({
    integrator: "",
  });
  const { tokens } = await lifi.getTokens({
    chains: [parseInt(chainId)],
  });
  const balances = await lifi.getTokenBalances(
    userAddress,
    tokens[parseInt(chainId)]
  );
  return balances
    .filter((balance) => {
      return balance.amount !== "0";
    })
    .map((balance): TokenInfo => {
      const amountBigInt = parseUnits(balance.amount, balance.decimals);
      const usdBigInt = parseUnits(balance.priceUSD, 18);
      const truncatedBalance =
        balance.amount.split(".")[0] +
        "." +
        balance.amount.split(".")[1].slice(0, 6);
      return {
        address: balance.address,
        decimals: balance.decimals,
        name: balance.name,
        symbol: balance.symbol,
        chainId: `0x${parseInt(chainId).toString(16)}` as SupportedChainIds,
        formattedBalance: truncatedBalance,
        balance: amountBigInt.toString(),
        tokenExchangeUsdValueCents: balance.priceUSD,
        tokenUri: balance.logoURI,
        balanceUsdValueCents: formatUnits(
          amountBigInt * usdBigInt,
          18 + balance.decimals
        ),
      };
    });
}

export async function getToken(
  tokenAddress: string,
  chainId: string,
  amount: string
): Promise<TokenInfo> {
  const lifi = new LiFi({
    integrator: "",
  });
  const tokenInfo = await lifi.getToken(parseInt(chainId), tokenAddress);
  const amountBigInt = BigInt(amount);
  const formattedAmount = formatUnits(amountBigInt, tokenInfo.decimals);
  const usdBigInt = parseUnits(tokenInfo.priceUSD, 18);
  const truncatedBalance =
    formattedAmount.split(".")[0] +
    "." +
    formattedAmount.split(".")[1].slice(0, 6);
  return {
    address: tokenInfo.address,
    decimals: tokenInfo.decimals,
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    chainId: `0x${parseInt(chainId).toString(16)}` as SupportedChainIds,
    formattedBalance: truncatedBalance,
    balance: amountBigInt.toString(),
    tokenExchangeUsdValueCents: tokenInfo.priceUSD,
    tokenUri: tokenInfo.logoURI,
    balanceUsdValueCents: formatUnits(
      amountBigInt * usdBigInt,
      18 + tokenInfo.decimals
    ),
  };
}
