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
import { EventLogs, columns } from "@/components/ui/columns";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { getSmartContractViewOnly } from "@/utils/getSmartContractViewOnly";
import { EventLog } from "ethers";


const Page = () => {
  const [isLoading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<EventLogs[]>([]);
  const [mintTokenId, setMintTokenId] = useState(0);
  const [burnTokenId, setBurnTokenId] = useState(0);
  const [pdfHash, setPdfHash] = useState<string>('');
  const [hasMetamask, setHasMetamask] = useState<boolean | null>(null);

  const handleHashGenerated = (hash: string) => {
    setPdfHash(hash);
  };

  const loadTransactionsTable = async () => {
    try {
      setLoading(true);
  
      const tokenizerContract = getSmartContractViewOnly();
  
      if (!tokenizerContract)
        return toast.error("Smart contract not retrieved.", {
          description: "",
          action: {
            label: "Got it",
            onClick: () => console.log("Error"),
          },
        });
  
      const mintedTokenEvents = await tokenizerContract.queryFilter("TokenMinted");
      const burnedTokenEvents = await tokenizerContract.queryFilter("TokenBurned");
  
      const transactionMintedLogs = mintedTokenEvents.map((event) => {
      const { args, transactionHash } = event as EventLog;
      const [tokenId, hash, timestamp] = args;
  
      

        return {
          eventType: "Token Minted",
          id: Number(tokenId),
          transcriptHash: hash,
          eventHash: transactionHash,
          eventTimestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
          rawTimestamp: Number(timestamp) * 1000
        };
      });

      const transactionBurnedLogs = burnedTokenEvents.map((event) => {
        const { args, transactionHash } = event as EventLog;
        const [tokenId, hash, timestamp] = args;
        return {
          eventType: "Token Burned",
          id: Number(tokenId),
          transcriptHash: hash,
          eventHash: transactionHash,
          eventTimestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
          rawTimestamp: Number(timestamp) * 1000
        };
      });

      const allTransactionLogs = [...transactionMintedLogs, ...transactionBurnedLogs]
      .sort((a, b) => b.rawTimestamp - a.rawTimestamp);
  
      console.log(allTransactionLogs);
      setTransactions(allTransactionLogs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMetamask(checkMetaMask());
    loadTransactionsTable();
  }, []);

  return (
    <div className='w-full'>
      {hasMetamask ? 
        (
          <div className='w-full py-0 px-0 lg:py-10 lg:px-20 md:py-10 md:px-20'>
            <h2 className="text-center text-emerald-500 text-4xl font-bold pb-10">TOR Minting and Burning</h2>
            <Card className='w-full mb-20 mx-auto'>
              <CardContent>
                <ConnectWallet  />
                <hr className='my-3 border-3' />
                <div className='mb-2'>
                <p className='font-bold'>Choose PDF and Generate Hash</p>
                  <GenerateHash onHashGenerated={handleHashGenerated} />
                </div>
                <div>
                  <p className='font-bold'>{pdfHash && `Generated Hash: ${pdfHash}`}</p>
                </div>
                <hr className='mt-5 mb-3 border-3' />
                <p className='mb-4 font-bold'>Mint or Burn (Create or Delete)</p>
                <div className='flex w-75'>
                  <Input
                    type="number"
                    onChange={(event) => setMintTokenId(Number(event.target.value))}
                    placeholder='Token ID (Student ID)'
                  />
                  <MintButton tokenId={mintTokenId} pdfHash={pdfHash}  />
                </div>
                <br />
                <div  className='flex w-75'>
                  <Input
                    type="number"
                    onChange={(event) => setBurnTokenId(Number(event.target.value))}
                    placeholder='Token ID (Student ID)'
                  />
                  <BurnButton tokenId={burnTokenId}  />
                </div>
                <hr className='my-5 border-3' />

                <MintCount />         
              </CardContent>
            </Card>
            <LatestTransactions />

            <div className="w-[400px] md:w-[500px] lg:w-[1000px] mx-auto px-0 pt-15 pb-10">
              {!isLoading ? (
                <div className="overflow-x-auto">
                  <DataTable columns={columns} data={transactions} />
                </div>
              ) : (
                <Card className='w-full lg:w-auto md:w-auto p-4'>
                  <CardContent className='font-bold text-center px-2 lg:px-6 md:px-6 text-emerald-500'>Loading...</CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (<div>No Metamask installed, No Access</div>)
      }       
    </div>
  )
}

export default Page
