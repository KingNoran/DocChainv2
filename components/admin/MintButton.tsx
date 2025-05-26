import React, { useState } from 'react';
import { isCallException } from 'ethers'; 
import { getSmartContract } from '@/utils/getSmartContract';
import { handleRevertError } from '@/utils/handleRevertError';


const MintButton = ({ tokenId, pdfHash}: { tokenId: number, pdfHash: string }) => {
  const [isLoading, setLoading] = useState(false);

  const mintPdfHash = async () => {
    setLoading(true);
    
    try {
      const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return alert("Metamask Account not connected.");
      if (!tokenId) return alert("Invalid Token ID Input");
      if (!pdfHash) return alert("Invalid Hash Input");

      const tokenizerHash = await tokenizerContract.mint(tokenId, pdfHash);

      console.log(`Loading - ${tokenizerHash.hash}`);

      await tokenizerHash.wait();
      
      console.log(`Success - ${tokenizerHash.hash}`);
    } catch (error) {
      if (isCallException(error)) {
        const contract = await getSmartContract();

        console.log(await handleRevertError(contract, error));
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="submit" onClick={mintPdfHash} disabled={isLoading}>
        {isLoading ? "Minting..." : "Mint"}
      </button>
    </div>
  );
};

export default MintButton;
