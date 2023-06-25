import { Circle } from "lucide-react";
import {
  Arbitrum,
  Ethereum,
  Optimism,
  Polygon,
} from "../../assets/icons-chains";

export type chainsDataType = keyof typeof chainsData;

export const chainsID = new Map<string, string>([
  ["Polygon", "0x89"],
  ["Ethereum", "0x1"],
  ["Arbitrum One", "0xa4b1"],
  ["Optimism", "0xa"]]
)

export const chainHex = new Set<string>([
  "89",
  "1",
  "a4b1",
  "a"]
)

export const chainsData = {
  Polygon: <Polygon className="rounded-full h-6 w-6" />,
  "Arbitrum One": <Arbitrum className="rounded-full h-6 w-6" />,
  Optimism: <Optimism className="rounded-full h-6 w-6" />,
  Ethereum: <Ethereum className="rounded-full h-6 w-6" />,
  Chain: <Circle className="rounded-full h-6 w-6" />,
};
