import { SupportedChainIds } from "../types/SupportedChainIds";

export const TXN_SCANNER_URLS: Record<SupportedChainIds, string> = {
  "0x1": "https://skylar-scanner.vercel.app/tx/1/",
  "0x89": "https://skylar-scanner.vercel.app/tx/137/",
  "0xa": "https://optimistic.etherscan.io/tx/",
  "0xa4b1": "https://arbiscan.io/tx/",
};

export const ADDRESS_SCANNER_URLS: Record<SupportedChainIds, string> = {
  "0x1": "https://skylar-scanner.vercel.app/address/",
  "0x89": "https://skylar-scanner.vercel.app/address/",
  "0xa": "https://optimistic.etherscan.io/address/",
  "0xa4b1": "https://arbiscan.io/address/",
};
