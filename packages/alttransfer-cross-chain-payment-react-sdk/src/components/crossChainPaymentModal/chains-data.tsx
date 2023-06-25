import { Circle } from "lucide-react";
import {
  Arbitrum,
  Avalanche,
  Fantom,
  Optimism,
  Polygon,
} from "../../assets/icons-chains";

export type chainsDataType = keyof typeof chainsData;
export const chainsData = {
  Polygon: <Polygon />,
  Avalanche: <Avalanche />,
  Arbitrum: <Arbitrum />,
  Optimism: <Optimism />,
  Fantom: <Fantom />,
  Chain: <Circle />
};
