import React, { useState, useEffect } from 'react';
import { getSmartContract } from '@/utils/getSmartContract';
import { EventLog } from 'ethers';


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
    try {
      const tokenizerContract = await getSmartContract();

      if (!tokenizerContract) return console.log("Metamask Account not connected.");

      setLoading(true);

      const contractEvents = await tokenizerContract.queryFilter("TokenMinted");
      const transactionLogs = contractEvents.slice(-5).reverse();

      const latestTransactions = transactionLogs.map((event) => {
        const { args, transactionHash } = event as EventLog;

        const [id, hash, timestamp] = args;
        const eventTransactionHash = transactionHash;

        console.log(
          id,
          hash,
          new Date(Number(timestamp) * 1000).toLocaleString()
        );

        const convertedTimestamp = new Date(
          Number(timestamp) * 1000
        ).toLocaleString();

        return {
          studentId: id,
          transcriptHash: hash,
          eventTimestamp: convertedTimestamp,
          eventHash: eventTransactionHash,
        };
      });

      setTransactions(latestTransactions);
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
                <p>Transaction Hash: {transaction.eventHash}</p>
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
