"use client";

import React, { useState } from 'react';
import { isCallException } from 'ethers'; 
import { getSmartContract } from '@/utils/getSmartContract';
import { handleRevertError } from '@/utils/handleRevertError';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';


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

      await fetch("/api/burn-update-tor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ studentId: tokenId }),
            });

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
      <Button className='bg-[#25388C] cursor-pointer' type="submit" onClick={burnToken} disabled={isLoading}>
        {isLoading ? "Burning..." : "Burn"}
      </Button>
    </div>
  );
};

export default BurnButton;
