import { SupportedChainIds } from "../../types/SupportedChainIds";
import { EthAddressType } from "../../types/evmTransaction";
import { LifiSwapDataReturnSchema } from "../../types/lifiSwapData";

const subgraphUrl =
  "https://api.thegraph.com/subgraphs/name/lifinance/lifi-diamond-v2-pol";

export async function getSwaps(
  userAddress: EthAddressType,
  currentChain: SupportedChainIds
) {
  const query = {
    query: `query GetUserTransfers { liFiTransfers( where: { fromAddress: \"${userAddress}\", fromChainId: ${parseInt(
      currentChain,
      16
    )} } ) { id transactionHash timestamp toAddress bridge fromAmount fromTokenAddress fromChainId toChainId } }`,
  };

  const data = await fetch(subgraphUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  });

  const parsedData = LifiSwapDataReturnSchema.parse(
    (await data.json()).data.liFiTransfers
  );

  return parsedData;
}
