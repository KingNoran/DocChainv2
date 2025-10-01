"use client";

import React, { useState, useEffect } from 'react';
import { getSmartContractViewOnly } from '@/utils/getSmartContractViewOnly';


const MintCount = () => {
  const [tokenCount, setTokenCount] = useState();
  const [isLoading, setLoading] = useState(false);

  const checkMintedTokenCount = async () => {
    setLoading(true);
    
    try {
      const tokenizerContract = getSmartContractViewOnly();

      if (!tokenizerContract) return console.log("Metamask Account not connected.");

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
      <p className='font-bold text-xl'>Minted token count: <span className='text-green-500'>{!isLoading ? (tokenCount) : ("Loading...")}</span></p>
    </div>
  );
}

export default MintCount
