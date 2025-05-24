import React, { useState } from 'react';
import { isCallException } from 'ethers'; 
import { getSmartContract } from '@/utils/getSmartContract';
import { handleRevertError } from '@/utils/handleRevertError';


const BurnButton = ({ tokenId }: { tokenId: number }) => {
  const [isLoading, setLoading] = useState(false);

  const burnToken = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask!");
      const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return alert("Metamask Account not connected.");

      if (!tokenId) return alert("Invalid Token ID Input");

      const tokenizerHash = await tokenizerContract.burn(tokenId);

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
      <button type="submit" onClick={burnToken} disabled={isLoading}>
        {isLoading ? "Burning..." : "Burn"}
      </button>
    </div>
  );
};

export default BurnButton;
