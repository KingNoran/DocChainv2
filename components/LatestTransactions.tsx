import React, { useState, useEffect } from "react";
import { getSmartContract } from "@/utils/getSmartContract";
import { EventLog, BytesLike } from "ethers";


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
      const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return console.log("Metamask Account not connected.");

      const checkIfHashStored = async (hash: BytesLike): Promise<boolean> => {
        console.log(await tokenizerContract.getStoredHashValue(hash));
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
        const eventTransactionHash = transactionHash;

        if (!(await checkIfHashStored(hash))) continue;

        const convertedTimestamp = new Date(
          Number(timestamp) * 1000
        ).toLocaleString();

        if (!storedHashes.has(hash) && !mintedTokenIds.has(id)) {
          latestTransactions.push({
            studentId: id,
            transcriptHash: hash,
            eventTimestamp: convertedTimestamp,
            eventHash: eventTransactionHash,
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
				{!isLoading &&
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
                <p>{transaction.eventTimestamp}</p> 
                <br />
              </li>                 
            ))}
				  </ul>
        }
    </div>
  );
};

export default LatestTransactions;
