'use server'

import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import React from 'react'

const Page = () => {

  return (
    <div>
      <Button
      onClick={() => signOut()}
    >
      Logout
    </Button>
    </div>
  )
}

export default Page
