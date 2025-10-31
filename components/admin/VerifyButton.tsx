"use client";

import React, { useState } from 'react';
import { isCallException } from 'ethers'; 
import { getSmartContract } from '@/utils/getSmartContractClient';
import { handleRevertError } from '@/utils/handleRevertError';

import { Button } from '@/components/ui/button';


const VerifyButton = ({ tokenId, pdfHash }: { tokenId: number, pdfHash: string }) => {
  const [isLoading, setLoading] = useState(false);

  const verifyPdfHash = async () => {
    setLoading(true);
    
		try {
			const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return alert("Metamask Account not connected.");

      const tokenTranscriptHash = await tokenizerContract.getTranscriptHash(tokenId);
			const isHashVerified = await tokenizerContract.verifyTranscriptHash(tokenId, pdfHash);

			console.log("Token ID:", tokenId);
			console.log("Retrieved hash:", tokenTranscriptHash);
			console.log(typeof pdfHash);
			console.log(typeof tokenTranscriptHash);

			if (isHashVerified) {
				console.log("MATCHED:", pdfHash, "==", tokenTranscriptHash);
			} else {
				console.log("NOT MATCHED", pdfHash, "!=", tokenTranscriptHash);
			}
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
      <Button type="submit" onClick={verifyPdfHash} disabled={isLoading}>
				{isLoading ? "Verifying..." : "Verify Hash"}
			</Button>
    </div>
  );
}

export default VerifyButton
