import { LiFi, type Route, type RoutesResponse } from "@lifi/sdk";
import type { ethers } from "ethers";
import { formatUnits, parseUnits } from "viem";
import type { SupportedChainIds } from "../../types/SupportedChainIds";
import type { TokenInfo } from "../../types/TokenInfo";

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
  targetAddress,
  userAddress,
}: {
  fromToken: TokenInfo;
  fromAmount: string;
  toToken: TokenInfo;
  targetAddress: string;
  userAddress: string;
  hexChainId: SupportedChainIds;
}) {
  const lifi = new LiFi({
    integrator: "",
  });

  const route = await lifi.getRoutes({
    fromAmount,
    fromChainId: parseInt(fromToken.chainId),
    fromTokenAddress: fromToken.address,
    toChainId: parseInt(toToken?.chainId ?? hexChainId),
    toTokenAddress: toToken.address,
    fromAddress: userAddress,
    toAddress: targetAddress,
  });
  console.log("route", route);
  return route;
}

export async function executeRoute(
  routeResp: RoutesResponse,
  signer: ethers.Signer,
  optimisticSettlement: boolean
) {
  const routes = routeResp.routes;
  const chosenRoute = routes[0];

  const lifi = new LiFi({
    integrator: "",
  });
  // executing a route
  return new Promise<string | undefined>(async (resolve, reject) => {
    try {
      await lifi.executeRoute(signer, chosenRoute, {
        updateRouteHook: (updatedRoute: Route) => {
          console.log("updatedRoute", updatedRoute);
          console.log("Ping! Everytime a status update is made!");
          if (optimisticSettlement) {
            if (
              updatedRoute.steps[0]?.execution?.process[0]?.status === "DONE" &&
              updatedRoute.steps[0]?.execution?.process[0]?.type ===
                "CROSS_CHAIN"
            ) {
              resolve(updatedRoute.steps[0].execution?.process[0].txLink);
            }
            if (
              updatedRoute.steps[0]?.execution?.process[1]?.status === "DONE" &&
              updatedRoute.steps[0]?.execution?.process[1]?.type ===
                "CROSS_CHAIN"
            ) {
              resolve(updatedRoute.steps[10].execution?.process[1].txLink);
            }
          } else if (
            updatedRoute.steps[0]?.execution?.process[1]?.status === "DONE" &&
            updatedRoute.steps[0]?.execution?.process[1]?.type ===
              "RECEIVING_CHAIN"
          ) {
            resolve(updatedRoute.steps[0].execution?.process[1]?.txLink);
          } else if (
            updatedRoute.steps[0]?.execution?.process[2]?.status === "DONE" &&
            updatedRoute.steps[0]?.execution?.process[2]?.type ===
              "RECEIVING_CHAIN"
          ) {
            resolve(updatedRoute.steps[0].execution?.process[2]?.txLink);
          } else if (
            updatedRoute.steps[0]?.execution?.process[0]?.status === "DONE" &&
            updatedRoute.steps[0]?.execution?.process[0]?.type === "SWAP"
          ) {
            resolve(updatedRoute.steps[0].execution?.process[0]?.txLink);
          } else if (
            updatedRoute.steps[0]?.execution?.process[1]?.status === "DONE" &&
            updatedRoute.steps[0]?.execution?.process[1]?.type === "SWAP"
          ) {
            resolve(updatedRoute.steps[0].execution?.process[1]?.txLink);
          }
        },
      });
    } catch (e) {
      console.error("Error executing route", e);
      reject(e);
    }
  });
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
  return await Promise.all(
    balances
      .filter((balance) => {
        return balance.amount !== "0";
      })
      .map(async (balance): Promise<TokenInfo> => {
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
      })
  );
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
    (formattedAmount.split(".")[1]?.slice(0, 6) ?? "00");
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
