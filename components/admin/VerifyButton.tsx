import React, { useState } from 'react';
import { getSmartContract } from '@/utils/getSmartContract';


const VerifyButton = ({ tokenId, pdfHash}: { tokenId: number, pdfHash: string }) => {
  const [isLoading, setLoading] = useState(false);
  const [isVerified, setVerified] = useState(false);

  
  const verifyPdfHash = async () => {
		try {
			const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return alert("Metamask Account not connected.");

			setLoading(true);
			const tokenTranscriptHash = await tokenizerContract.getTranscriptHash(tokenId);

			console.log("Token ID:", tokenId);
			console.log("Retrieved hash:", tokenTranscriptHash);
			console.log(typeof pdfHash);
			console.log(typeof tokenTranscriptHash);

			if (pdfHash === tokenTranscriptHash) {
				console.log("MATCHED:", pdfHash, "==", tokenTranscriptHash);
			} else {
				console.log("NOT MATCHED", pdfHash, "!=", tokenTranscriptHash);
			}
		} catch (error) {
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
