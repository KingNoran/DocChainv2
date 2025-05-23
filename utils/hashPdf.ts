import { keccak256 } from "ethers";

export const hashPdf = async (file: File): Promise<string> => {
    const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
    const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
    const pdfHash: string = keccak256(uint8Array);

    return pdfHash;
}
