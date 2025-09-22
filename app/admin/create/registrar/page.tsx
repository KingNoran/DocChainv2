import { RegistrarFormProvider } from '@/components/admin/contexts/RegistrarFormContext'
import RegistrarForms from '@/components/admin/forms/RegistrarForms'
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
        <RegistrarFormProvider>
          <RegistrarForms />
        </RegistrarFormProvider>
      </section>
    </>
  )
}

export default page
