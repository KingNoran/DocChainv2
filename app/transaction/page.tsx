'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ModeToggle } from '@/components/ui/toggle-mode';

import LatestTransactions from '@/components/LatestTransactions'
import TransactionCard from '@/components/TransactionCard';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { hashPdf } from '@/utils/hashPdf';
import { checkFileType } from '@/utils/checkFileType';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


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
  const [file, setFile] = useState<File | null | undefined>(null);
  const [filename, setFilename] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (!checkFileType(event.target.files[0])) {
        setFilename("Please select a PDF file format.")
      } else {
        setFile(event.target.files[0])
        setFilename(event.target.files[0].name)
      }  
    }
	};

  const handleFetchData = async () => {
    setLoading(true);

		if (!file) {
			alert("Please select a file first");
      setLoading(false);
			return;
		}

    const pdfHash = await hashPdf(file);

    const res = await fetch('/api/fetch-data', {
      method: 'POST',
      body: JSON.stringify({ pdfHash }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await res.json();

    console.log(`Data: ${data.data}`);
    console.log(`Status: ${data.status}`)

    if (data.status == 200) {
      setTransactionData(data.data);  
    }
    else {
      setTransactionData(null);
    }

    setHasSearched(true)
    setLoading(false)
  };

  useEffect(() => {
    if (hasSearched && !transactionData && !loading) {
      setShowError(true);

      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer); 
    }
  }, [hasSearched, transactionData, loading]);

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
      <div className="flex-1 flex flex-col items-center justify-center my-15 mx-5">
        <div className="text-emerald-400 text-7xl sm:text-8xl md:text-9xl lg:text-9xl font-bold font-['Inter'] leading-[96px] mb-0 md:mb-4">Doc. Chain</div>
        <div className="text-muted-foreground text-center text-xl md:text-2xl lg:text-2xl font-normal font-['Inter'] leading-relaxed mb-12">Welcome to the future of document verification</div>

        <div className="w-100 mx-5 px-6 lg:px-0 md:px-0">
          <div className='flex flex-col-reverse md:flex-row gap-2'>
            <Button
              className="bg-emerald-400 mx-auto px-auto hover:bg-green-800 x-auto cursor-pointer text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload PDF
            </Button>
            <Input className='w-full' readOnly value={filename} />
          </div>
          
          <Input
            type="file"
            accept="application/pdf"
            placeholder="Upload TOR file"
            className="w-full hidden h-14 px-4 pt-6 pb-2 bg-card rounded-lg border border-border text-muted-foreground text-base font-normal font-['Inter'] focus:outline-none focus:border-emerald-400"
            onChange={handleFileInput}
            ref={fileInputRef}
          />
        </div>

        <div className="mt-8">
          <button 
            className="w-56 h-14 py-4 bg-emerald-400 rounded-lg text-white text-base font-medium font-['Inter'] leading-normal hover:bg-emerald-500 transition-colors cursor-pointer" 
            onClick={handleFetchData}
            disabled={!file || loading}
          >
            {loading ? "Verifying..." : "Verify Document"}
          </button>
        </div>

        <div className='mt-10 md:mt-15 lg:mt-15'>
          {!loading ? (
              hasSearched && (
                transactionData ? (
                  <TransactionCard data={transactionData} />
                ) : (showError && (
                  <Card className='w-full lg:w-auto md:w-auto p-4'>
                    <CardContent className='font-bold px-2 lg:px-6 md:px-6 text-emerald-500 text-center'>No Transaction Found!<hr className='my-2' /><span className='text-[#25388C]'>TOR is not yet verified or Wrong File Uploaded.</span></CardContent>
                  </Card>
                ))
              )
            ) : (
              <Card className='w-full lg:w-auto md:w-auto p-4'>
                <CardContent className='font-bold px-2 lg:px-6 md:px-6 text-emerald-500'>Loading...</CardContent>
              </Card>
          )}
        </div>

        <div className='mt-20'>
          <LatestTransactions />
        </div>
      </div>
      <Footer />
    </div>
  );
} 

export default GuestTransactionPage;