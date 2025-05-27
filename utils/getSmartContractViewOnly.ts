import { JsonRpcProvider, Contract } from "ethers";
import { contractABI, contractAddress } from "@/app/constants/contractDetails";


export const getSmartContractViewOnly = (): Contract => {
    const provider = new JsonRpcProvider("https://sepolia.era.zksync.dev");

    return new Contract(contractAddress, contractABI, provider);
};