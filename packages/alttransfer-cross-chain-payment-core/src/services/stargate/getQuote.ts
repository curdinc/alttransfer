import { ethers } from "ethers";

export async function getQuoteStargate(network: ethers.providers.Networkish, apiKey: string, destChainId: number, functionType: number, toAddress: string) {
    const provider = new ethers.providers.AlchemyProvider(network, apiKey);
      
    const stargateABI =[
        "function quoteLayerZeroFee(uint16 _dstChainId, uint8 _functionType, bytes _toAddress, bytes _transferAndCallPayload, (uint256, uint256, bytes) _lzTxParams) external view returns (uint256, uint256)"]
    
        // TODO: change to stargate address dynamically based on the chain.
    const stargateRouter = new ethers.Contract('0x45A01E4e04F14f7A4a6702c74187c5F6222033cd', stargateABI , provider )
      
    console.log('stargateABI', stargateABI);
    const data = await stargateRouter.quoteLayerZeroFee(ethers.BigNumber.from(destChainId), ethers.BigNumber.from(functionType), toAddress, '0x',[0, 0, '0x'])
    console.log('data', data);

    const fees = ethers.BigNumber.from(data[0]);
    console.log('fees', fees)
}