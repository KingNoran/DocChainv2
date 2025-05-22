import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const Page = () => {
  return (
    <div className="flex flex-col items-start gap-5">
      <Button>Choose File</Button>
      <Button>Generate Hash</Button>
      <form action="">
        <Input></Input>
        <Button type="submit">Mint PDF Hash</Button>
      </form>
      <Button>Burn Token</Button>
    </div>
  )
}

export default Page
