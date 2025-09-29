"use client";

import React, { useState, useEffect} from 'react';
import ConnectWallet from '@/components/admin/ConnectWallet';
import GenerateHash from '@/components/admin/GenerateHash';
import MintButton from '@/components/admin/MintButton';
import BurnButton from '@/components/admin/BurnButton';
import MintCount from '@/components/admin/MintCount';
import LatestTransactions from '@/components/LatestTransactions';

import { Input } from '@/components/ui/input';

import { checkMetaMask } from '@/utils/checkMetamask';
import { Card, CardContent } from '@/components/ui/card';


const Page = () => {
  const [mintTokenId, setMintTokenId] = useState(0);
  const [burnTokenId, setBurnTokenId] = useState(0);
  const [pdfHash, setPdfHash] = useState<string>('');
  const [hasMetamask, setHasMetamask] = useState<boolean | null>(null);

  const handleHashGenerated = (hash: string) => {
    setPdfHash(hash);
  };

  useEffect(() => {
    setHasMetamask(checkMetaMask());
  }, []);

  return (
    <div className='w-full'>
      {hasMetamask ? 
        (
          <div className='w-full py-10 px-20'>
            <h2 className="text-center text-emerald-500 text-4xl font-bold pb-10">TOR Minting and Burning</h2>
            <Card className='w-full mb-20 mx-auto'>
              <CardContent>
                <ConnectWallet  />
                <hr className='my-3 border-3' />
                <div className='mb-2'>
                <p className='font-bold'>Choose and Generate</p>
                  <GenerateHash onHashGenerated={handleHashGenerated} />
                </div>
                <div>
                  <p className='font-bold'>{pdfHash && `Generated Hash: ${pdfHash}`}</p>
                </div>
                <hr className='mt-5 mb-3 border-3' />
                <p className='mb-4 font-bold'>Mint or Burn</p>
                <div className='flex w-75'>
                  <Input
                    type="number"
                    onChange={(event) => setMintTokenId(Number(event.target.value))}
                  />
                  <MintButton tokenId={mintTokenId} pdfHash={pdfHash}  />
                </div>
                <br />
                <div  className='flex w-75'>
                  <Input
                    type="number"
                    onChange={(event) => setBurnTokenId(Number(event.target.value))}
                  />
                  <BurnButton tokenId={burnTokenId}  />
                </div>
                <hr className='my-5 border-3' />

                <MintCount />         
              </CardContent>
            </Card>
            <LatestTransactions />
          </div>
        ) : (<div>No Metamask installed, No Access</div>)
      }       
    </div>
  )
}

export default Page
