"use client";

import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'
import React from 'react'

const Page = () => {
  const {data:session} = useSession();
  
  return (
    <div>
      <Button className='bg-primary-admin' onClick={()=>{redirect("/registrar/create/student")}}>+ Create Student</Button>=
    </div>
  )
}

export default Page
