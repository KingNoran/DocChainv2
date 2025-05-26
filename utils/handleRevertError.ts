import { CallExceptionError, Interface, BytesLike, Contract } from 'ethers';
import { contractABI } from '@/app/constants/contractDetails'; 
import { toast } from 'sonner';

const contractInterface = new Interface(contractABI);

export const handleRevertError = async (contract: Contract | null, error: CallExceptionError): Promise<string | number> => {
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

    const errorMessages: Record<string, {name: string, message: string}> = {
        Tokenizer__NotAuthorized: {name: 'Not authorized', message: `The Metamask account: ${errorArgs.account}, is not authorized.`},
        Tokenizer__TokenAlreadyMinted: {name: 'Token already Mmnted', message: `The Token ID: ${errorArgs.tokenId}, is already minted with the TOR hash, ${errorName!.name === "Tokenizer__TokenAlreadyMinted" ? await contract?.getTranscriptHash(errorArgs.tokenId): 'N/A'}.`},
        Tokenizer__TokenNotMinted: {name: 'Token not yet minted', message: `The Token ID: ${errorArgs.tokenId}, is not yet minted.`},
        Tokenizer__InvalidHash: {name: 'Invalid hash', message:``},
        Tokenizer__InvalidTokenId: {name: 'Invalid token ID', message:``},
        Tokenizer__HashAlreadyStored: {name: 'PDF hash already stored', message: `The TOR hash ${errorArgs.pdfHash}, is already stored on-chain with the Token ID: ${errorName!.name === "Tokenizer__HashAlreadyStored" ?await contract?.getTokenIdByHash(errorArgs.pdfHash): 'N/A'}.`},
    };
    
    return (
        toast.error(`Error: ${errorMessages[errorName!.name].name}`, {
            description: `${errorMessages[errorName!.name].message}`,
            action: {
                label: "Got it",
                onClick: () => console.log("Error"),
            }
        })
    );
};