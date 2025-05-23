import { signOut } from '@/auth';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-inter">
      <main className="flex-1 flex flex-col justify-center items-center px-4">
        <Hero />

        <div>
          TransactionTable
        </div>

        <form 
          action={async () => {
            "use server";

            await signOut();
          }}
        >
          <Button className='cursor-pointer'>Logout</Button>
        </form>
      </main>
    </div>
  )
}

export default Page;