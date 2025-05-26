'use client';

import { ModeToggle } from '@/components/ui/toggle-mode';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function GuestTransactionPage() {
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
            type="text"
            placeholder="Enter transaction ID"
            className="w-full h-14 px-4 pt-6 pb-2 bg-card rounded-lg border border-border text-muted-foreground text-base font-normal font-['Inter'] focus:outline-none focus:border-emerald-400"
          />
          <label className="absolute top-2 left-4 text-muted-foreground text-sm font-normal font-['Inter'] leading-tight">Public Key</label>
        </div>

        <div className="mt-8">
          <button className="w-56 h-14 py-4 bg-emerald-400 rounded-lg text-black text-base font-medium font-['Inter'] leading-normal hover:bg-emerald-500 transition-colors cursor-pointer">
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