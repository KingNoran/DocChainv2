"use server";

import { getSmartContract } from "@/lib/getSmartContract";
import { handleRevertError } from "@/utils/handleRevertError";
import { isCallException } from "ethers";


export const mintPdf = async (tokenId: number, pdfHash: string) => {
    try {
        const tokenizerContract = await getSmartContract();

        if (!tokenizerContract) throw new Error('No smart contract integrated.');     
        if (!tokenId) throw new Error('Invalid token ID');        
        if (!pdfHash) throw new Error('Invalid hash');

        const tokenizerHash = await tokenizerContract.mint(tokenId, pdfHash);

        console.log(`Loading - ${tokenizerHash.hash}`);

        await tokenizerHash.wait();

        console.log(`Success - ${tokenizerHash.hash}`);
        
        return { success: true, hash: tokenizerHash.hash };
    } catch (error: any) {
        if (isCallException(error)) {
            const contract = await getSmartContract();
    
            const decoded = await handleRevertError(contract, error);

            return { success: false, errorName: decoded.name, errorMsg: decoded.message };
        }

        return { success: false, errorMsg: error.message };
    }
};
