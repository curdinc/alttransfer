import {
  Alchemy,
  Network,
  TokenBalance,
  TokenMetadataResponse,
} from "alchemy-sdk";
import { SupportedChainIds } from "../../types/SupportedChainIds";

const mapChainIdToAlchemyNetwork: Record<SupportedChainIds, Network> = {
  "0x1": Network.ETH_MAINNET,
  "0x89": Network.MATIC_MAINNET,
  "0xa": Network.OPT_MAINNET,
  "0xa4b1": Network.ARB_MAINNET,
};

export async function getUserTokenBalance(
  chainId: SupportedChainIds,
  userAddress: string,
  alchemyApiKey: string
) {
  const config = {
    apiKey: alchemyApiKey,
    network: mapChainIdToAlchemyNetwork[chainId],
  };
  const alchemy = new Alchemy(config);

  const balances = await alchemy.core.getTokenBalances(userAddress);

  // Remove tokens with zero balance
  balances.tokenBalances = balances.tokenBalances.filter((token) => {
    return token.tokenBalance !== "0";
  });

  // Counter for SNo of final output
  let i = 1;

  const result: (TokenMetadataResponse &
    TokenBalance & { formattedBalance: string })[] = [];

  // Loop through all tokens with non-zero balance
  for (let token of balances.tokenBalances) {
    // Get metadata of token
    const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

    // Get balance of token
    let balance: number | string | null = token.tokenBalance;
    console.log("balance", balance);
    if (!balance || !metadata.decimals) {
      continue;
    }
    // Compute token balance in human-readable format
    balance = (parseInt(balance) /
      Math.pow(10, metadata.decimals ?? 18)) as number;
    balance = balance.toFixed(2);

    result.push({
      ...balances.tokenBalances[i],
      ...metadata,
      formattedBalance: balance,
    });
    // Print name, balance, and symbol of token
    console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
  }

  return result;
}

export async function getTokenMetadata(
  tokenAddress: string,
  chainId: SupportedChainIds,
  alchemyApiKey: string
) {
  const config = {
    apiKey: alchemyApiKey,
    network: mapChainIdToAlchemyNetwork[chainId],
  };
  const alchemy = new Alchemy(config);
  const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
  return metadata;
}
