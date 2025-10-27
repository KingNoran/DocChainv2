import { JsonRpcProvider, Contract, Wallet } from "ethers";
import { contractABI, contractAddress } from "@/app/constants/contractDetails";


export const getSmartContract = async (): Promise<Contract> => {
    const privateKey = "f746124bf7bc64462d29b17f3c62d32081c5d13c994531907a8b97d3e7652dfa";

    console.log(privateKey);

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