"use client";

import { RegistrarStudentFormProvider } from '@/components/registrar/contexts/RegistrarStudentFormContext'
import RegistrarStudentForms from '@/components/registrar/forms/StudentForms'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  const {data: session, status} = useSession();

  if (status === "loading") 
    return <p>Loading...</p>;
  else 
    return (
    <div className='flex flex-col gap-5'>
      <Button asChild variant="outline">
        <Link href="/registrar/create">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <RegistrarStudentFormProvider>
          <RegistrarStudentForms session={session!} type={"create"}></RegistrarStudentForms>
        </RegistrarStudentFormProvider>
      </section>
    </div>
  )
}

export default Page
