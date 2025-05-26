"use client";

import { signOut } from "@/auth";

import { toast } from "sonner";
import React, { useState, useEffect } from "react";

import { getSmartContract } from "@/utils/getSmartContract";
import { EventLog } from "ethers";

import { EventLogs, columns } from "./columns";
import { DataTable } from "./data-table";

const Page = () => {
  const [isLoading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<EventLogs[]>([]);

  const loadTransactionsTable = async () => {
    try {
      setLoading(true);
  
      const tokenizerContract = await getSmartContract();
  
      if (!tokenizerContract)
        return toast.error("Metamask Account not connected.", {
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
    loadTransactionsTable();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-inter">
      <main className="flex-1 flex flex-col justify-center items-center px-4">

        <section className="hero">
          <div className="flex flex-1 flex-col gap-5 items-center">
            <h1 className='text-center'>Doc. Chain</h1>
            <p className='text-muted-foreground text-center'>Verify Cavite State University TOR via public key</p>
          </div>
        </section>

        <div className="container mx-auto px-0 py-10">
          {!isLoading ? (
            <DataTable columns={columns} data={transactions} />
          ) : (
            "Loading..."
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
