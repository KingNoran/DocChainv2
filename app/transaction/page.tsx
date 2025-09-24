'use client';

import React, { useState } from 'react';
import { ModeToggle } from '@/components/ui/toggle-mode';

import LatestTransactions from '@/components/LatestTransactions'
import TransactionCard from '@/components/TransactionCard';
import Footer from '@/components/Footer';
import Link from 'next/link';


type TransactionData = {
  userId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  pdfHash: string;
  eventTimestamp: string;
  eventHash: string;
}

const GuestTransactionPage = () => {
  const [tokenId, setTokenId] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);

  const handleFetchData = async () => {
    setHasSearched(true);
  
    const res = await fetch('/api/fetch-data', {
      method: 'POST',
      body: JSON.stringify({ tokenId }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await res.json();
    console.log(data);
    setTransactionData(data);
    setHasSearched(false);

    console.log(transactionData);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground font-inter">
      {/* Custom Header */}
      <header className="w-full h-20 flex items-center justify-between px-8 border-b border-border bg-background/80 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Logo placeholder or add your logo here */}
          <span className="text-xl font-bold">DocChain</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/login">
            <button className="px-6 py-2 rounded-lg border border-foreground text-foreground text-base font-medium hover:bg-foreground/10 transition-colors cursor-pointer">Log In</button>
          </Link>
          
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center my-15">
        <div className="text-emerald-400 text-9xl font-bold font-['Inter'] leading-[96px] mb-4">Doc. Chain</div>
        <div className="text-muted-foreground text-2xl font-normal font-['Inter'] leading-relaxed mb-12">Welcome to the future of document verification</div>

        <div className="relative w-[480px]">
          <input
            type="number"
            placeholder="Enter student ID"
            className="w-full h-14 px-4 pt-6 pb-2 bg-card rounded-lg border border-border text-muted-foreground text-base font-normal font-['Inter'] focus:outline-none focus:border-emerald-400"
            onChange={(event) => setTokenId(Number(event.target.value))}
          />
          <label className="absolute top-2 left-4 text-muted-foreground text-sm font-normal font-['Inter'] leading-tight">Student ID</label>
        </div>

        <div className="mt-8">
          <button className="w-56 h-14 py-4 bg-emerald-400 rounded-lg text-black text-base font-medium font-['Inter'] leading-normal hover:bg-emerald-500 transition-colors cursor-pointer" onClick={handleFetchData}>
            Search
          </button>
        </div>

        <div className='mt-20'>
          {hasSearched && (
            transactionData ? (
              <TransactionCard data={transactionData} />
            ) : ("No Transactions found ")
          )}
        </div>

        <div className='mt-17'>
          <LatestTransactions />
        </div>
      </div>
      <Footer />
    </div>
  );
} 

export default GuestTransactionPage;