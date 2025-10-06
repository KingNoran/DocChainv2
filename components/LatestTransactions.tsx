'use client';

import React, { useState, useEffect } from "react";
import { getSmartContractViewOnly } from "@/utils/getSmartContractViewOnly";
import { EventLog, BytesLike } from "ethers";
import { toast } from "sonner";
import { Card, CardContent } from './ui/card';


type Transaction = {
  studentId: string;
  transcriptHash: string;
  eventTimestamp: string;
  eventHash: string;
};

const LatestTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState(false);

  const loadLatestTransactions = async () => {
    setLoading(true);

    try {
      const tokenizerContract = getSmartContractViewOnly();

      if (!tokenizerContract) 
        return toast.error('Error: Fetching Contract.', {
          description: 'There is a problem on fetching smart contract',
          action: {
            label: "Got it",
            onClick: () => console.log("Error"),
          },
        });

      const checkIfHashStored = async (hash: BytesLike): Promise<boolean> => {
        return await tokenizerContract.getStoredHashValue(hash);
      } 

      const mintedTokenEvents = await tokenizerContract.queryFilter("TokenMinted");
      const recentMintEvents = mintedTokenEvents.reverse();

      const storedHashes = new Set();
      const mintedTokenIds = new Set();

      const latestTransactions: Transaction[] = [];

      for (const event of recentMintEvents) {
        const { args, transactionHash } = event as EventLog;
        const [id, hash, timestamp] = args;

        if (!(await checkIfHashStored(hash))) continue;

        const convertedTimestamp = new Date(
          Number(timestamp) * 1000
        ).toLocaleString();

        if (!storedHashes.has(hash) && !mintedTokenIds.has(id)) {
          latestTransactions.push({
            studentId: id,
            transcriptHash: hash,
            eventTimestamp: convertedTimestamp,
            eventHash: transactionHash,
          });

          storedHashes.add(hash);
          mintedTokenIds.add(id);
        }

        if (latestTransactions.length == 5) break;
      }

      setTransactions(latestTransactions);
      console.log(latestTransactions)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatestTransactions();
  }, []);

  return (
    <div>
      <h2 className="text-center text-emerald-500 text-4xl font-bold pb-10">Latest Transactions</h2>
				{!isLoading ?
          <ul>
            {transactions && transactions.map((transaction) => (
              <li key={transaction.eventHash}>
                <Card>
                  <CardContent>
                    <h2 className="font-bold mb-3 truncate w-90 lg:w-full md:w-full cursor-pointer">
                      {"Transaction Hash: "}
                      <a 
                        className="text-green-500"
                        href={`https://zksync-sepolia.blockscout.com/tx/${transaction.eventHash}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {transaction.eventHash}
                      </a>
                    </h2>
                    <p className='w-full lg:my-0 md:my-0 my-3'>TOR hash: <span className='text-green-500 font-bold whitespace-normal break-all'>{transaction.transcriptHash}</span></p>
                    <p>Token ID: {transaction.studentId}</p> 
                    <p>Block Timestamp: {transaction.eventTimestamp}</p> 
                  </CardContent>
                </Card>
                <br />
              </li>                 
            ))}
				  </ul> : (
            <Card className='w-full lg:w-auto md:w-auto p-4'>
              <CardContent className='font-bold text-center px-2 lg:px-6 md:px-6 text-emerald-500'>Loading...</CardContent>
            </Card>
          )
        }
    </div>
  );
};

export default LatestTransactions;
