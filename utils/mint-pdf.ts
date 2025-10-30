import { getSmartContract } from "@/utils/getSmartContract";


export const mintPdf = async ( tokenId: number, pdfHash: string) => {
    try {
        const tokenizerContract = await getSmartContract();

        if (!tokenizerContract) throw new Error('No smart contract intergrated.');     
        if (!tokenId) throw new Error('Invalid token ID');        
        if (!pdfHash) throw new Error('Invalid hash');

        const tokenizerHash = await tokenizerContract.mint( tokenId, pdfHash);

        console.log(`Loading - ${tokenizerHash.hash}`);

        await tokenizerHash.wait();

        console.log(`Success - ${tokenizerHash.hash}`);
        
        return { success: true, hash: tokenizerHash.hash };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
