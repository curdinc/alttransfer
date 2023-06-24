import { ethers } from "ethers";
import type { WalletClient } from "viem";
import type { SupportedChainIds } from "../types/SupportedChainIds";
import type { TokenInfo } from "../types/TokenInfo";

export type AltTransferCrossChainSdkConstructorArgs = {
  getItemPrice(this: void): Promise<
    | {
        isNative: true;
        price: string;
        chainId: SupportedChainIds;
      }
    | {
        isNative: false;
        tokenAddress: string;
        price: string;
        chainId: SupportedChainIds;
      }
  >;
  getRecipientAddress(this: void): Promise<{ address: string }>;

  config: {
    ChainAPIs: Record<SupportedChainIds, string>;
  };
};

export class AltTransferCrossChainSdk {
  private getItemPrice: AltTransferCrossChainSdkConstructorArgs["getItemPrice"];
  private getRecipientAddress: AltTransferCrossChainSdkConstructorArgs["getRecipientAddress"];
  private config: AltTransferCrossChainSdkConstructorArgs["config"];
  /**
   * @example
   * const sdk = AltTransferCrossChainPaymentSdk({
   *   async getItemPrice() {
   *       // you can fetch the price from your backend if needed here.
   *       return  {
   *           isNative: false,
   *           tokenAddress: '0x123456789...',
   *           // price is in the currency's base units
   *           price: '12000000000'
   *       }
   *   }
   *   async getRecipientAddress() {
   *       // you can fetch the address you want the token or coin to be sent too.
   *       return '0x123456789...'
   *   }
   *   config={{
   *     // Needed to display an accurate Token balance available for the users to choose.
   *     ChainAPIs: "",
   *   }}
   * })
   *
   * @param {AltTransferCrossChainSdkConstructorArgs["getItemPrice"]} args.getItemPrice - A function that returns the price of the item that the user is purchasing.
   * @param {AltTransferCrossChainSdkConstructorArgs["getRecipientAddress"]} args.getRecipientAddress - A function that returns the address of funds that the user is sending.
   * @param {AltTransferCrossChainSdkConstructorArgs["config"]} args.config - Miscellaneous configuration options.
   */
  constructor(args: AltTransferCrossChainSdkConstructorArgs) {
    this.config = args.config;
    this.getItemPrice = args.getItemPrice;
    this.getRecipientAddress = args.getRecipientAddress;
  }

  /**
   * This function returns a list of currencies that the user can use to pay for the item.
   *
   * @example
   * const currencies = await sdk.getUsableCurrencies({ chainId: "0x89", address: "0x123456789..." });
   * console.log('currencies', currencies)
   *
   * @param {SupportedChainIds} args.chainId - The chainId of the chain that the user is paying from.
   * @param {string} args.address - The address of the user.
   */
  async getUsableCurrencies({
    chainId,
    address,
  }: {
    chainId: SupportedChainIds;
    address: string;
  }) {
    // todo: call Quicknode or alchemy api to get user token list
    const provider = new ethers.providers.JsonRpcProvider(
      this.config.ChainAPIs[chainId]
    );
    const tokens = await provider.send("qn_getWalletTokenBalance", [
      { wallet: address },
    ]);
    const token_list = tokens.result;
    const usable_tokens: Array<TokenInfo> = token_list.map((token: any) => ({
      address: token.address,
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
      balance: token.totalBalance,
      chainId: chainId,
      tokenUri: "",
      balanceUsdValueCents: "",
      tokenExchangeUsdValueCents: "",
    }));
    // todo: contrast this list with those that has liquidity on the right liquidity pool base on the current chain
    return usable_tokens;
  }

  /**
   * Returns the price of the item that the user is purchasing.
   */
  async getItemPriceInfo(): Promise<TokenInfo> {
    const itemPrice = await this.getItemPrice();
    // todo: fetch the token info and remove below
    return {
      address: "0x123456789...",
      chainId: "0x89",
      decimals: 18,
      name: "USDC",
      symbol: "USDC",
      balance: "",
      balanceUsdValueCents: "",
      tokenExchangeUsdValueCents: "",
    };
  }

  /**
   * Returns the address that the user is sending funds to.
   */
  async getDestinationAddress(): Promise<string> {
    const recipientAddress = await this.getRecipientAddress();
    return recipientAddress.address;
  }

  /**
   * Use to initiate the payment process.
   * @param {TokenInfo} args.currency - The currency that the user is paying with.
   * @param {WalletClient} args.walletClient - The wallet client that the user is using to pay for the transaction.
   * @param {boolean} args.optimisticSettlement - If true, the function will resolve without waiting for the funds to settle on the other chain
   */
  async pay({
    currency,
    optimisticSettlement,
    walletClient,
  }: {
    walletClient: WalletClient;
    currency: TokenInfo;
    optimisticSettlement: boolean;
  }) {
    await Promise.resolve();
    console.log(
      "walletClient, currency, optimisticSettlement",
      walletClient,
      currency,
      optimisticSettlement
    );
    // todo: Approve token
    // todo: Call Hans contract to initiate payment
    throw new Error("Not implemented");
  }
}
