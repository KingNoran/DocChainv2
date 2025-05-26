"use client";

import AuthForm from '@/components/AuthForm';
import { signInWithCredentials } from '@/lib/actions/auth';
import { loginSchema } from '@/lib/validations';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ui/toggle-mode';
import Link from 'next/link';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/my-profile');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="w-full h-20 flex items-center justify-between px-8 border-b border-border bg-background/80 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Logo placeholder or add your logo here */}
          <span className="text-xl font-bold">DocChain</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/guest">
            <button className="px-6 py-2 rounded-lg border border-foreground text-foreground text-base font-medium hover:bg-foreground/10 transition-colors cursor-pointer">Get Started</button>
          </Link>
        </div>
      </header>
      <AuthForm 
        type="LOG_IN"
        schema={loginSchema}
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={signInWithCredentials}
      />
    </>
  );
}

export default Page;

