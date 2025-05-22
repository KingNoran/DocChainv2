import UserForms from '@/components/admin/forms/UserForms'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return <>
      <Button asChild variant="outline">
        <Link href="/admin/create">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <UserForms />
      </section>
    </>
}

export default Page
