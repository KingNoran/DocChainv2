import React, { useState, useEffect } from 'react';
import { getSmartContract } from '@/utils/getSmartContract';

const MintCount = () => {
  const [tokenCount, setTokenCount] = useState();
  const [isLoading, setLoading] = useState(false);

  const checkMintedTokenCount = async () => {
    try {
      const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return console.log("Metamask Account not connected.");

      setLoading(true);

      const mintedCount = await tokenizerContract.getTokenMintedCount();

      setTokenCount(mintedCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMintedTokenCount();
  }, []);

  return (
    <div>
      <p>Minted token count: {!isLoading && tokenCount}</p>
    </div>
  );
}

export default MintCount
