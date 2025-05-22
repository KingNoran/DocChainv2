import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Students</h2>
        <Button className="bg-primary-admin hover:bg-muted-foreground" asChild>
          <Link href="/admin/create/new">+ Create a New Student</Link>
        </Button>
      </div>
    </section>
  )
}

export default Page
