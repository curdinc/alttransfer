import { z } from "zod";

export const SupportedChainIdsSchema = z.enum(["0x89", "0xa", "0xa4b1", "0x1"]);
export type SupportedChainIds = z.infer<typeof SupportedChainIdsSchema>;
