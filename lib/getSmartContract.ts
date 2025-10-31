import { JsonRpcProvider, Contract, Wallet } from "ethers";
import { contractABI, contractAddress } from "@/app/constants/contractDetails";


export const getSmartContract = async (): Promise<Contract> => {
    const privateKey = process.env.METAMASK_PRIVATE_KEY;

    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in environment variables");
    }
    
    const provider: JsonRpcProvider = new JsonRpcProvider("https://sepolia.era.zksync.dev");
    const wallet: Wallet = new Wallet(privateKey, provider)

    const contract: Contract = new Contract(
        contractAddress,
        contractABI,
        wallet
    );

    return contract;
};