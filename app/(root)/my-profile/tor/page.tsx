'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Page = () => {
  const [show, setShow] = useState(false);
  const [torHash, setTorHash] = useState('');

  return (
    <div className="flex min-h-[80vh] items-center justify-center font-inter px-2 sm:px-4 md:px-8">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-xl bg-card border border-border p-4 sm:p-8 text-card-foreground">
        <div className="mb-2">
          <h2 className="text-2xl sm:text-3xl font-normal text-foreground leading-8 sm:leading-10 mb-2">View Your Transcript of Records</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-normal mb-6">Enter your TOR Hash to access your official TOR securely.</p>
        </div>
        <form>
          <Label htmlFor="tor-hash" className="text-muted-foreground text-xs sm:text-sm font-normal leading-tight mb-1 block">
            TOR Hash
          </Label>
          <div className="relative mb-2">
            <Input
              id="tor-hash"
              type={show ? 'text' : 'password'}
              placeholder="Enter your TOR hash..."
              className="bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-lg h-10 sm:h-12 pr-10"
              value={torHash}
              onChange={e => setTorHash(e.target.value)}
              autoComplete="off"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-emerald-300 focus:outline-none"
              onClick={() => setShow(s => !s)}
              aria-label={show ? 'Hide TOR hash' : 'Show TOR hash'}
            >
              {/* Eye icon */}
              {show ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="#34D399" strokeWidth="1.5" d="M2.5 10S5.5 5 10 5s7.5 5 7.5 5-3 5-7.5 5S2.5 10 2.5 10Z"/><circle cx="10" cy="10" r="2.5" stroke="#34D399" strokeWidth="1.5"/></svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="#34D399" strokeWidth="1.5" d="M2.5 10S5.5 5 10 5s7.5 5 7.5 5-3 5-7.5 5S2.5 10 2.5 10Z"/><circle cx="10" cy="10" r="2.5" stroke="#34D399" strokeWidth="1.5"/><path stroke="#34D399" strokeWidth="1.5" d="M4 16l12-12"/></svg>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 mb-8">
            <span className="flex items-center justify-center w-4 h-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="2" fill="none" />
                <rect x="11" y="10" width="2" height="6" rx="1" fill="#34D399" />
                <rect x="11" y="7" width="2" height="2" rx="1" fill="#34D399" />
              </svg>
            </span>
            <span className="text-muted-foreground text-xs sm:text-sm font-normal leading-tight">Security Information</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Button type="submit" className="bg-primary text-primary-foreground font-medium text-base rounded-lg h-10 sm:h-12 w-full sm:w-72 hover:bg-emerald-300 transition-colors">View TOR</Button>
            <button type="button" className="text-muted-foreground text-base font-normal leading-normal hover:underline w-full sm:w-auto">Cancel</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Page;

