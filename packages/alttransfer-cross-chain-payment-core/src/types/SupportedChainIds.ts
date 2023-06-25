import { z } from "zod";

export const SupportedChainIdsSchema = z.enum([
  "0x89", //polygon
  "0xa", //optimism
  "0xa4b1", //arbitrum
  "0x1", //ethereum
  "0x64", // gnosis
]);
export type SupportedChainIds = z.infer<typeof SupportedChainIdsSchema>;
