import { CallExceptionError, Interface, BytesLike, Contract } from 'ethers';
import { contractABI } from '@/app/constants/contractDetails'; 


const contractInterface = new Interface(contractABI);

export const handleRevertError = async (contract: Contract | null, error: CallExceptionError): Promise<string> => {
    const errorData: BytesLike = error.data!;
    
    const errorName = contractInterface.parseError(errorData);
    const errorArgs = errorName!.args;

    /*
        error Tokenizer__NotAuthorized(address account);
        error Tokenizer__TokenAlreadyMinted(uint256 tokenId, bytes32 pdfHash);
        error Tokenizer__TokenNotMinted(uint256 tokenId);
        error Tokenizer__InvalidHash(bytes32 pdfHash);
        error Tokenizer__HashAlreadyStored(uint256 tokenId, bytes32 pdfHash);
        error Tokenizer__InvalidTokenId(uint256 tokenId);
    */

    const errorMessages: Record<string, string> = {
        Tokenizer__NotAuthorized: `The Metamask account: ${errorArgs.account}, is not authorized.`,
        Tokenizer__TokenAlreadyMinted: `The Token ID: ${errorArgs.tokenId}, is already minted with the TOR hash, ${errorName!.name === "Tokenizer__TokenAlreadyMinted" ? await contract?.getTranscriptHash(errorArgs.tokenId): 'N/A'}.`,
        Tokenizer__TokenNotMinted: `The Token ID: ${errorArgs.tokenId}, is not yet minted.`,
        Tokenizer__InvalidHash: `Invalid Hash.`,
        Tokenizer__InvalidTokenId: `Invalid Token ID.`,
        Tokenizer__HashAlreadyStored: `The TOR hash ${errorArgs.pdfHash}, is already stored on-chain with the Token ID: ${errorName!.name === "Tokenizer__HashAlreadyStored" ?await contract?.getTokenIdByHash(errorArgs.pdfHash): 'N/A'}.`,
    };
    
    return errorMessages[errorName!.name];
};