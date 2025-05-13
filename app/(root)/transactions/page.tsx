import { signOut } from '@/auth';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import React from 'react'

const Page = () => {
  return (
    <div>
      <Hero />

      TransactionTable
      <form 
        action={async () => {
          "use server";

          await signOut();
        }}
      >
          <Button className='cursor-pointer'>Logout</Button>
      </form>
    </div>
  )
}

export default Page;
