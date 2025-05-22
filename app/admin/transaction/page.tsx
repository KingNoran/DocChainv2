import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import React from 'react'

const Page = () => {
  return (
    <div>
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

export default Page
