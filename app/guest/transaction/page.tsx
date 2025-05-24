'use client';

import Footer from '@/components/Footer';
import Link from 'next/link';

export default function GuestTransactionPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground font-inter">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-emerald-400 text-9xl font-bold font-['Inter'] leading-[96px] mb-4">Doc. Chain</div>
        <div className="text-muted-foreground text-2xl font-normal font-['Inter'] leading-relaxed mb-12">Welcome to the future of document verification</div>

        <div className="relative w-[480px]">
          <input
            type="text"
            placeholder="Enter transaction ID"
            className="w-full h-14 px-4 pt-6 pb-2 bg-card rounded-lg border border-border text-muted-foreground text-base font-normal font-['Inter'] focus:outline-none focus:border-emerald-400"
          />
          <label className="absolute top-2 left-4 text-muted-foreground text-sm font-normal font-['Inter'] leading-tight">Public Key</label>
        </div>

        <div className="mt-8">
          <button className="w-56 h-14 py-4 bg-emerald-400 rounded-lg text-black text-base font-medium font-['Inter'] leading-normal hover:bg-emerald-500 transition-colors">
            Enter
          </button>
        </div>

        <div className="mt-8 text-center">
          <span className="text-muted-foreground text-sm font-normal font-['Inter'] leading-tight">Already have an account? </span>
          <Link href="/login">
            <span className="text-yellow-400 text-sm font-normal font-['Inter'] leading-tight cursor-pointer">Sign in</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
} 