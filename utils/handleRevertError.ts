import { CallExceptionError, Interface, BytesLike } from 'ethers';
import { contractABI } from './contractDetails'; 


const contractInterface = new Interface(contractABI);

export const handleRevertError = (error: CallExceptionError): string => {
    const errorData: BytesLike = error.data!;
    
    console.log(typeof errorData);
    const errorName = contractInterface.parseError(errorData);

    return `ON-CHAIN ERROR: ${errorName?.name}`;
};