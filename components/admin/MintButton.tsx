import React, { useState } from 'react';
import { isCallException } from 'ethers'; 
import { getSmartContract } from '@/utils/getSmartContract';
import { handleRevertError } from '@/utils/handleRevertError';


const MintButton = ({ tokenId, pdfHash}: { tokenId: number, pdfHash: string }) => {
  const [isLoading, setLoading] = useState(false);

  const mintPdfHash = async () => {
    try {
      const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return alert("Metamask Account not connected.");

      if (!tokenId) return alert("Invalid Token ID Input");
      if (!pdfHash) return alert("Invalid Hash Input");

      const tokenizerHash = await tokenizerContract.mint(tokenId, pdfHash);

      setLoading(true);
      console.log(`Loading - ${tokenizerHash.hash}`);

      await tokenizerHash.wait();
      
      console.log(`Success - ${tokenizerHash.hash}`);
    } catch (error) {
      if (isCallException(error)) {
        console.log(handleRevertError(error));
      }

      console.log(error);
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
