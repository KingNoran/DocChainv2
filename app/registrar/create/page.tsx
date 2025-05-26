"use client";

import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = () => {
  return (
    <div>
      <Button className='bg-primary-admin' onClick={()=>{redirect("/registrar/create/student")}}>+ Create Student</Button>
    </div>
  )
}

export default Page
