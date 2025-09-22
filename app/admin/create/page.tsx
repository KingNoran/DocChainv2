import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-col items-start justify-between gap-2">
        <h2 className="text-xl font-semibold">All Students</h2>
        <div className="flex flex-col gap-2">
          <Button className="bg-primary-admin hover:bg-muted-foreground" asChild>
          <Link href="/admin/create/student">+ Create a New Student</Link>
        </Button>
        <Button className="bg-primary-admin hover:bg-muted-foreground" asChild>
          <Link href="/admin/create/registrar">+ Create a New Registrar</Link>
        </Button>
        <Button className="bg-primary-admin hover:bg-muted-foreground" asChild>
          <Link href="/admin/create/admin">+ Create a New Admin</Link>
        </Button>
        </div>
      </div>
    </section>
  )
}

export default Page
