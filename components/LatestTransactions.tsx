
import React, { useState, useEffect } from "react";
import { getSmartContractViewOnly } from "@/utils/getSmartContractViewOnly";
import { EventLog, BytesLike } from "ethers";
import { toast } from "sonner";


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
      <h2>Latest Transactions</h2>
				{!isLoading ?
          <ul>
            {transactions && transactions.map((transaction) => (
              <li key={transaction.eventHash}>
                <p>
                  {"Transaction Hash: "}
                  <a 
                    href={`https://zksync-sepolia.blockscout.com/tx/${transaction.eventHash}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {transaction.eventHash}
                  </a>
                </p>
                <p>Token ID: {transaction.studentId}</p>
                <p>PDF hash: {transaction.transcriptHash}</p>
                <p>Block Timestamp: {transaction.eventTimestamp}</p> 
                <br />
              </li>                 
            ))}
				  </ul> : "Loading..."
        }
    </div>
  );
};

export default LatestTransactions;
