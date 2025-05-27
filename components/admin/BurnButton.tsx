"use client";

import React, { useState } from 'react';
import { isCallException } from 'ethers'; 
import { getSmartContract } from '@/utils/getSmartContract';
import { handleRevertError } from '@/utils/handleRevertError';
import { toast } from 'sonner';


const BurnButton = ({ tokenId }: { tokenId: number }) => {
  const [isLoading, setLoading] = useState(false);

  const burnToken = async () => {
    setLoading(true);
    
    try {
      const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) 
        return toast.error('Error: No Metamask installed.', {
          description: 'Metamask is not installed',
          action: {
            label: "Got it",
            onClick: () => console.log("Error"),
          },
        });
        
      if (!tokenId)
        return toast.error('Error: Invalid token ID', {
          description: '',
          action: {
            label: "Got it",
            onClick: () => console.log("Error"),
          },
        });

      const tokenizerHash = await tokenizerContract.burn(tokenId);

      console.log(`Loading - ${tokenizerHash.hash}`);

      await tokenizerHash.wait();

      console.log(`Success - ${tokenizerHash.hash}`);
    } catch (error) {
      if (isCallException(error)) {
        const contract = await getSmartContract();
        
        await handleRevertError(contract, error);
      } else {
        console.log(error);
      }
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
