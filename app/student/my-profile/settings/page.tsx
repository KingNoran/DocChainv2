"use client";

import { useProfile } from '@/components/ProfileWrapper'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card';
import React from 'react'

const Page = () => {

    const profile = useProfile();

  return (
    <div className="flex gap-5">
      <div>
        <Card className="px-4">Current email: {profile.email}</Card>
        <Button variant={"default"}>Change Email</Button>
      </div>
      <div>
        <Card className="px-4">Current password: {"**********"}</Card><Button variant={"default"}>Change Password</Button>
      </div>
    </div>
  )
}

export default Page
