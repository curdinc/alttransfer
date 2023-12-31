import { ethers } from "ethers";
import type { Transport, WalletClient } from "viem";
import { formatUnits, zeroAddress } from "viem";
import type { Chain } from "viem/chains";
import {
  getTokenMetadata,
  getUserTokenBalance,
} from "../services/alchemy/getUserTokenBalance";
import { walletClientToSigner } from "../services/ethers";

import {
  executeRoute,
  getLiFiQuote,
  getToken,
  getTokens,
} from "../services/lifi/getLiFiQuote";
import { getQuote } from "../services/uniswap/getQuote";
import type { SupportedChainIds } from "../types/SupportedChainIds";
import type { TokenInfo } from "../types/TokenInfo";

export type AltTransferCrossChainSdkConstructorArgs = {
  getItemPrice(this: void): Promise<
    | {
        isNative: true;
        amount: string;
        chainId: SupportedChainIds;
      }
    | {
        isNative: false;
        tokenAddress: string;
        amount: string;
        chainId: SupportedChainIds;
      }
  >;
  getRecipientAddress(this: void): Promise<{ address: string }>;
  text: {
    brandName: string;
  };
  config: {
    ChainAPIs: Record<"0x1" | "0x89", string>;
    alchemyApiKey: string;
  };
  optimisticSettlement?: boolean;
};

export class AltTransferCrossChainSdk {
  private getItemPrice: AltTransferCrossChainSdkConstructorArgs["getItemPrice"];
  private getRecipientAddress: AltTransferCrossChainSdkConstructorArgs["getRecipientAddress"];
  private config: AltTransferCrossChainSdkConstructorArgs["config"];
  private optimisticSettlement: boolean;
  text: AltTransferCrossChainSdkConstructorArgs["text"];
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
    this.optimisticSettlement = args.optimisticSettlement ?? false;
    this.text = args.text;
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
    let tokens: TokenInfo[] = [];
    try {
      // not supported by quicknode
      if (chainId === "0xa" || chainId === "0xa4b1" || chainId === "0x64") {
        const tokenList = await getUserTokenBalance(
          chainId,
          address,
          this.config.alchemyApiKey
        );

        tokens = (await Promise.all(
          tokenList
            .filter((token) => !!token.logo)
            .map(async (token) => {
              if (
                token.tokenBalance === "0" ||
                !token.decimals ||
                !token.name ||
                !token.symbol
              ) {
                return;
              }

              const result = {
                address: token.contractAddress,
                decimals: token.decimals ?? 18,
                name: token.name ?? "",
                symbol: token.symbol ?? "",
                balance: token.tokenBalance ?? "0",
                formattedBalance: formatUnits(
                  BigInt(token.tokenBalance ?? 0),
                  token.decimals ?? 18
                ),
                chainId: chainId,
                tokenUri: token.logo ?? undefined,
                balanceUsdValueCents: "",
                tokenExchangeUsdValueCents: "",
              };
              return result;
            })
        )) as any;
        return getTokens(address, chainId);
      } else {
        const provider = new ethers.providers.JsonRpcProvider(
          this.config.ChainAPIs[chainId]
        );
        const tokenList = await provider.send("qn_getWalletTokenBalance", [
          { wallet: address },
        ]);

        tokens = await Promise.all(
          tokenList.result.map(async (token: any) => {
            if (
              token.totalBalance === "0" ||
              !token.decimals ||
              !token.name ||
              !token.symbol
            ) {
              console.log("missing token info");
              return;
            }

            const metadata = await getTokenMetadata(
              token.address,
              chainId,
              this.config.alchemyApiKey
            );
            if (!metadata.logo) {
              return;
            }

            const result = {
              address: token.address,
              decimals: parseInt(token.decimals),
              name: token.name,
              symbol: token.symbol,
              balance: token.totalBalance,
              formattedBalance: formatUnits(
                BigInt(token.totalBalance),
                token.decimals
              ),
              chainId,
              tokenUri: metadata.logo,
              balanceUsdValueCents: "",
              tokenExchangeUsdValueCents: "",
            };

            const quote = await getQuote({
              fromToken: {
                ...result,
                balanceUsdValueCents: "",
                tokenExchangeUsdValueCents: "",
              },
              hexChainId: chainId,
              alchemyApiKey: this.config.alchemyApiKey,
            });
            console.log("quote", quote);
            if (!quote || !quote.formattedUsdcValue) return;

            let tokenExchangeUsdValueCents = "0";
            try {
              tokenExchangeUsdValueCents = ethers.utils
                .parseUnits(quote.formattedUsdcValue, 6)
                .mul(100)
                .toString()
                .split(".")[0];
              console.log(
                "tokenExchangeUsdValueCents",
                tokenExchangeUsdValueCents
              );

              const usdValueBigNumber = ethers.utils.parseUnits(
                quote.formattedUsdcValue,
                6
              );
              const balanceUsdValueCents = ethers.utils.formatUnits(
                usdValueBigNumber
                  .mul(ethers.BigNumber.from(token.totalBalance))
                  .div(ethers.utils.parseUnits("1", token.decimals)),
                6
              );
              console.log("balanceUsdValueCents", balanceUsdValueCents);
              return {
                ...result,
                balanceUsdValueCents,
                tokenExchangeUsdValueCents,
                uniSwapInfo: {
                  feeAmount: quote.feeAmount,
                },
              };
            } catch (e) {
              console.log("error", e);
              const usdValueBigNumber = ethers.utils.parseUnits(
                quote.formattedUsdcValue,
                18
              );
              const balanceUsdValueCents = ethers.utils.formatUnits(
                usdValueBigNumber
                  .mul(ethers.BigNumber.from(token.totalBalance))
                  .div(ethers.utils.parseUnits("1", token.decimals)),
                18
              );
              console.log("balanceUsdValueCents", balanceUsdValueCents);
              return {
                ...result,
                balanceUsdValueCents,
                tokenExchangeUsdValueCents: "0",
                uniSwapInfo: {
                  feeAmount: quote.feeAmount,
                },
              };
            }
          })
        );
        return tokens;
      }
    } catch (e) {
      console.log("error", e);
    }
  }

  /**
   * Returns the price of the item that the user is purchasing.
   */
  async getItemPriceInfo(): Promise<TokenInfo> {
    const itemPrice = await this.getItemPrice();

    const tokenInfo = await getToken(
      itemPrice.isNative ? zeroAddress : itemPrice.tokenAddress,
      itemPrice.chainId,
      itemPrice.amount
    );
    return tokenInfo;
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
    payingAmount,
    walletClient,
  }: {
    walletClient: WalletClient<Transport, Chain>;
    payingAmount: string;
    currency: TokenInfo;
  }) {
    const signer = walletClientToSigner(walletClient);

    const toToken = await this.getItemPriceInfo();
    const toAddress = await this.getDestinationAddress();
    const quote = await getLiFiQuote({
      fromToken: currency,
      fromAmount: payingAmount,
      userAddress: await signer.getAddress(),
      targetAddress: toAddress,
      toToken,
      hexChainId: currency.chainId,
    });
    return await executeRoute(quote, signer, this.optimisticSettlement);
  }
}
