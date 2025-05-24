import React, { useState } from 'react';
import { isCallException } from 'ethers'; 
import { getSmartContract } from '@/utils/getSmartContract';
import { handleRevertError } from '@/utils/handleRevertError';


const VerifyButton = ({ tokenId, pdfHash }: { tokenId: number, pdfHash: string }) => {
  const [isLoading, setLoading] = useState(false);
  
  const verifyPdfHash = async () => {
		try {
			const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return alert("Metamask Account not connected.");

			setLoading(true);

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
        handleRevertError(error);
      }

			console.log(error);
		} finally {
      setLoading(false);
    }
	};
  
  return (
    <div>
      <button type="submit" onClick={verifyPdfHash} disabled={isLoading}>
				{isLoading ? "Verifying..." : "Verify Hash"}
			</button>
    </div>
  );
}

export default VerifyButton