import { auth } from '@/auth';
import StudentOverview from '@/components/StudentOverview';
import { Button } from '@/components/ui/button';
import { db } from '@/database/drizzle';
import { students, users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { signOut } from 'next-auth/react';
import React from 'react'

const Page = async () => {
  const session = await auth();
  const user = await db.select().from(users).where(eq(users.email, session?.user?.email!));
  const student = await db.select().from(students).where(eq(students.userId, user[0]["userId"]));
  const input = {...student[0], ...user[0]};

  return (
    <>
      <StudentOverview {...input} />
    </>
  )
}

export default Page;
