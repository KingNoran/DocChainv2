import { BrowserProvider, JsonRpcSigner, Contract } from "ethers";
import { contractABI, contractAddress } from "@/app/constants/contractDetails";

export const getSmartContract = async (): Promise<Contract> => {
	const ethProvider: BrowserProvider = new BrowserProvider(window.ethereum);
	const ethSigner: JsonRpcSigner = await ethProvider.getSigner();

	const contract: Contract = new Contract(
		contractAddress,
		contractABI,
		ethSigner
	);

	return contract;
};