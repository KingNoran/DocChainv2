import { AdminFormProvider } from '@/components/admin/contexts/AdminFormContext'
import AdminForms from '@/components/admin/forms/AdminForms'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <Button asChild variant="outline">
        <Link href="/admin/create">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <AdminFormProvider>
          <AdminForms />
        </AdminFormProvider>
      </section>
    </>
  )
}

export default page
