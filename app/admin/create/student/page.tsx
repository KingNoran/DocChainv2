"use client";

import { StudentFormProvider } from '@/components/admin/contexts/StudentFormContext';
import StudentForms from '@/components/admin/forms/StudentForms'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Page = () => {


  return <>
      <Button asChild variant="outline">
        <Link href="/admin/create">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <StudentFormProvider>
          <StudentForms />
        </StudentFormProvider>
      </section>
    </>
}

export default Page
