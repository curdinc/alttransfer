import { z } from "zod";
import { EthAddressSchema, EthHashSchema } from "./evmTransaction";

const LiFiSwapDataSchema = z.object({
  id: z.string(),
  transactionHash: EthHashSchema,
  timestamp: z.string(),
  toAddress: EthAddressSchema,
  bridge: z.string(),
  fromAmount: z.string(),
  fromTokenAddress: EthAddressSchema,
  fromChainId: z.number(),
  toChainId: z.number(),
});

export const LifiSwapDataReturnSchema = z.array(LiFiSwapDataSchema);
