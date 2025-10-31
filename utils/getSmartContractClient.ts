import { BrowserProvider, JsonRpcSigner, Contract } from "ethers";
import { contractABI, contractAddress } from "@/app/constants/contractDetails";
import { checkMetaMask } from "./checkMetamask";


export const getSmartContract = async (): Promise<Contract> => {
    if (!checkMetaMask()) {
    	throw new Error("Ethereum provider not available");
  	}

    const ethProvider: BrowserProvider = new BrowserProvider(window.ethereum);
    const ethSigner: JsonRpcSigner = await ethProvider.getSigner();

    const contract: Contract = new Contract(
		contractAddress,
		contractABI,
		ethSigner
	);

    return contract;
};