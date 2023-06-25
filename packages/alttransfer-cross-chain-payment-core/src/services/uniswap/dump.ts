import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import {
  AlphaRouter,
  SwapOptionsSwapRouter02,
  SwapRoute,
  SwapType,
} from "@uniswap/smart-order-router";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { FeeAmount, computePoolAddress } from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { SupportedChainIds } from "../../types/SupportedChainIds";
import { TokenInfo } from "../../types/TokenInfo";

export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const QUOTER_CONTRACT_ADDRESS =
  "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

export async function quote({
  fromToken,
  toToken,
  hexChainId,
  alchemyApiKey,
}: {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  hexChainId: SupportedChainIds;
  alchemyApiKey: string;
}): Promise<string[]> {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    new ethers.providers.AlchemyProvider(parseInt(hexChainId), alchemyApiKey)
  );
  const poolConstants = await getPoolConstants({
    fromToken,
    toToken,
    hexChainId,
    alchemyApiKey,
  });

  const quotes: string[] = [];

  for (const poolConstant of poolConstants) {
    const quotedAmountOut =
      await quoterContract.callStatic.quoteExactInputSingle(
        poolConstant.token0,
        poolConstant.token1,
        poolConstant.fee,
        fromToken.balance,
        0
      );
    console.log("fromToken", fromToken);
    console.log("poolConstant", poolConstant);
    console.log("quotedAmountOut", quotedAmountOut);
    console.log(
      "ethers.utils.formatUnits(quotedAmountOut, toToken.decimals)",
      ethers.utils.formatUnits(quotedAmountOut, toToken.decimals)
    );
    console.log(
      "ethers.utils.formatUnits(quotedAmountOut, fromToken.decimals)",
      ethers.utils.formatUnits(quotedAmountOut, fromToken.decimals)
    );
    quotes.push(quotedAmountOut);
  }

  return quotes;
}

async function getPoolConstants({
  fromToken,
  toToken,
  hexChainId,
  alchemyApiKey,
}: {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  hexChainId: SupportedChainIds;
  alchemyApiKey: string;
}): Promise<
  {
    token0: string;
    token1: string;
    fee: number;
  }[]
> {
  const targetToken = new Token(
    parseInt(hexChainId),
    fromToken.address,
    fromToken.decimals,
    fromToken.symbol,
    fromToken.name
  );
  const sourceToken = new Token(
    parseInt(hexChainId),
    toToken.address,
    toToken.decimals,
    toToken.symbol,
    toToken.name
  );
  const result: {
    token0: string;
    token1: string;
    fee: number;
  }[] = [];

  const feeMapping: Record<string, FeeAmount> = {
    "0": FeeAmount.LOWEST,
    "1": FeeAmount.LOW,
    "2": FeeAmount.MEDIUM,
    "3": FeeAmount.HIGH,
  };
  for (let i = 0; i < 4; ++i) {
    const currentPoolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: sourceToken,
      tokenB: targetToken,
      fee: feeMapping[i.toString()],
    });
    console.log("currentPoolAddress", currentPoolAddress);
    const poolContract = new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      new ethers.providers.AlchemyProvider(parseInt(hexChainId), alchemyApiKey)
    );
    try {
      const [token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
      ]);

      result.push({
        token0,
        token1,
        fee,
      });
    } catch (e) {
      console.error(
        "Error fetching pool information for",
        e,
        feeMapping[i.toString()],
        fromToken
      );
    }
  }

  return result;
}

export async function generateRoute({
  fromToken,
  toToken,
  toAmount,
  hexChainId,
  userAddress,
  alchemyApiKey,
}: {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  toAmount: string;
  hexChainId: SupportedChainIds;
  userAddress: string;
  alchemyApiKey: string;
}): Promise<SwapRoute | null> {
  console.log("parseInt(hexChainId),", parseInt(hexChainId));
  const router = new AlphaRouter({
    chainId: parseInt(hexChainId),
    provider: new ethers.providers.AlchemyProvider(undefined, alchemyApiKey),
  });

  const options: SwapOptionsSwapRouter02 = {
    recipient: userAddress,
    slippageTolerance: new Percent(5, 1_000), //0.5%
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  };

  const amount = CurrencyAmount.fromRawAmount(
    new Token(
      parseInt(hexChainId),
      toToken.address,
      toToken.decimals,
      toToken.symbol,
      toToken.name
    ),
    toAmount
  );
  console.log("fromToken", fromToken);

  const targetToken = new Token(
    parseInt(hexChainId),
    fromToken.address,
    fromToken.decimals,
    fromToken.symbol,
    fromToken.name
  );
  console.log("targetToken", targetToken);

  const route = await router.route(
    amount,
    targetToken,
    TradeType.EXACT_OUTPUT,
    options
  );

  return route;
}
