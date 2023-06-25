import { Circle } from "lucide-react";
import {
  Arbitrum,
  Avalanche,
  Ethereum,
  Fantom,
  Optimism,
  Polygon,
} from "../../assets/icons-chains";

export type ChainsDataType = keyof typeof chainsData;
export const chainsData = {
  Polygon: <Polygon className="rounded-full h-6 w-6" />,
  Avalanche: <Avalanche className="rounded-full h-6 w-6" />,
  Arbitrum: <Arbitrum className="rounded-full h-6 w-6" />,
  Optimism: <Optimism className="rounded-full h-6 w-6" />,
  Fantom: <Fantom className="rounded-full h-6 w-6" />,
  Etherium: <Ethereum className="rounded-full h-6 w-6" />,
  Chain: <Circle className="rounded-full h-6 w-6" />,
};
