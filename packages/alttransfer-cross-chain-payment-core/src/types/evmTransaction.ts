import { z } from "zod";

export const EthAddressSchema = z.custom<`0x${string}`>((val) => {
  return _EthAddressSchema.safeParse(val).success;
});
export type EthAddressType = z.infer<typeof EthAddressSchema>;
export const _EthAddressSchema = z.string().regex(/^0x[0-9,a-f,A-F]{40}$/);
export const EthHashSchema = z.custom<`0x${string}`>((val) => {
  return _EthHashSchema.safeParse(val).success;
});
export type EthHashType = z.infer<typeof EthHashSchema>;
export const _EthHashSchema = z.string().regex(/^0x[0-9a-f]{64}$/);