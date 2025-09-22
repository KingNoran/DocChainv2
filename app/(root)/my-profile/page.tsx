"use client";

import { useProfile } from '@/components/ProfileWrapper';
import StudentOverview from '@/components/StudentOverview';
import React from 'react'

const Page = () => {
  const input = useProfile();

  return (
    <>
      <StudentOverview {...input} />
    </>
  )
}

export default Page;
