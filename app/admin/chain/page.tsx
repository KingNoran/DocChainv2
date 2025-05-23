import React, { useState } from 'react';
import ConnectWallet from '@/components/admin/ConnectWallet';
import GenerateHash from '@/components/admin/GenerateHash';
import MintButton from '@/components/admin/MintButton';
import BurnButton from '@/components/admin/BurnButton';
import MintCount from '@/components/admin/MintCount';
import LatestTransactions from '@/components/admin/LatestTransactions';

import { checkMetaMask } from '@/utils/checkMetamask';


const Page = () => {
  const [mintTokenId, setMintTokenId] = useState(0);
  const [burnTokenId, setBurnTokenId] = useState(0);
  const [pdfHash, setPdfHash] = useState<string>('');

  const handleHashGenerated = (hash: string) => {
    setPdfHash(hash);
  };

  return (
    <div>
      {checkMetaMask() ? 
        (
          <>
            <ConnectWallet />
            <br />
            <div>
              <GenerateHash onHashGenerated={handleHashGenerated} />
            </div>
            <div>
              <p>{pdfHash && `Generated Hash: ${pdfHash}`}</p>
            </div>
            <br />
            <div>
              <input
                type="number"
                onChange={(event) => setMintTokenId(Number(event.target.value))}
              />
              <MintButton tokenId={mintTokenId} pdfHash={pdfHash}  />
            </div>
            <br />
            <div>
              <input
                type="number"
                onChange={(event) => setBurnTokenId(Number(event.target.value))}
              />
              <BurnButton tokenId={burnTokenId}  />
            </div>
            <br />
            <MintCount />
            <br />
            <LatestTransactions />
          </>
        ) : (<div>No Metamask account, No Access</div>)
      }       
    </div>
  )
}

export default Page
