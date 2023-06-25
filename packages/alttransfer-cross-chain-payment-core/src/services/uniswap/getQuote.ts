import { Token } from "@uniswap/sdk-core";
import IUniswapV3Factory from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import QuoterABI from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { FeeAmount, Pool } from "@uniswap/v3-sdk";
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
  alchemyApiKey,
}: {
  fromToken: TokenInfo;
  toToken?: TokenInfo;
  hexChainId: SupportedChainIds;
  userAddress: string;
  alchemyApiKey: string;
}) {
  toToken = toToken ?? {
    address: USDC_ADDRESSES[hexChainId],
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
    chainId: hexChainId,
    balance: "",
    balanceUsdValueCents: "",
    tokenExchangeUsdValueCents: "100",
  };

  const UNISWAP_FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  const provider = new ethers.providers.AlchemyProvider(
    parseInt(hexChainId),
    alchemyApiKey
  );

  const factoryContract = new ethers.Contract(
    UNISWAP_FACTORY_ADDRESS,
    IUniswapV3Factory.abi,
    provider
  );

  const result: string[] = [];
  const feeMapping: Record<string, FeeAmount> = {
    "0": FeeAmount.LOWEST,
    "1": FeeAmount.LOW,
    "2": FeeAmount.MEDIUM,
    "3": FeeAmount.HIGH,
  };
  for (let i = 0; i < 4; ++i) {
    // loading pool smart contract address
    const poolAddress = await factoryContract.getPool(
      fromToken.address,
      toToken.address,
      feeMapping[i.toString()]
    );

    if (Number(poolAddress).toString() === "0") {
      // there is no such pool for provided In-Out tokens.
      console.warn(
        `Error: No pool ${fromToken.symbol}-${toToken?.symbol} with fee: ${
          feeMapping[i.toString()]
        }`
      );
      continue;
    }

    const poolContract = new ethers.Contract(
      poolAddress,
      IUniswapV3PoolABI.abi,
      provider
    );

    const [immutables, state] = await Promise.all([
      getPoolImmutables(poolContract),
      getPoolState(poolContract),
    ]);

    const tokenIn = new Token(
      parseInt(hexChainId),
      toToken.address,
      toToken.decimals,
      toToken.symbol,
      toToken.name
    );
    const targetToken = new Token(
      parseInt(hexChainId),
      fromToken.address,
      fromToken.decimals,
      fromToken.symbol,
      fromToken.name
    );
    const pool = new Pool(
      tokenIn,
      targetToken,
      immutables.fee,
      state.sqrtPriceX96.toString(),
      state.liquidity.toString(),
      state.tick
    );

    console.log(
      `1 ${pool.token0.symbol} = ${pool.token0Price.toSignificant()} ${
        pool.token1.symbol
      }`
    );
    console.log(
      `1 ${pool.token1.symbol} = ${pool.token1Price.toSignificant()} ${
        pool.token0.symbol
      }`
    );
    result.push(pool.token1Price.toSignificant());
  }
  console.log("result", result);
  return { formattedUsdcValue: result.at(-1) };
}

async function getPoolImmutables(poolContract: ethers.Contract) {
  const [
    fee,
    // factory, token0, token1,  tickSpacing, maxLiquidityPerTick
  ] = await Promise.all([
    poolContract.fee(),
    // poolContract.factory(),
    // poolContract.token0(),
    // poolContract.token1(),
    // poolContract.tickSpacing(),
    // poolContract.maxLiquidityPerTick(),
  ]);

  return {
    fee: fee,
    // factory: factory,
    // token0: token0,
    // token1: token1,
    // tickSpacing: tickSpacing,
    // maxLiquidityPerTick: maxLiquidityPerTick,
  };
}
async function getPoolState(poolContract: ethers.Contract) {
  const [liquidity, slot] = await Promise.all([
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    liquidity: liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };
}

export async function getRequiredInputAmount(
  fromToken: string,
  toToken: string,
  poolFee: number,
  amountOut: string,
  hexChainId: SupportedChainIds,
  alchemyApiKey: string
) {
  const UNISWAP_QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
  const quoterContract = new ethers.Contract(
    UNISWAP_QUOTER_ADDRESS,
    QuoterABI.abi,
    new ethers.providers.AlchemyProvider(parseInt(hexChainId), alchemyApiKey)
  );

  const quotedAmountOut =
    await quoterContract.callStatic.quoteExactOutputSingle(
      fromToken,
      toToken,
      poolFee,
      amountOut,
      0
    );

  return quotedAmountOut;
}
