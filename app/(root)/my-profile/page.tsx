import StudentOverview from '@/components/StudentOverview';
import { db } from '@/database/drizzle';
import { students, users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import React from 'react'

const Page = async () => {
  const user = await db.select().from(users);
  const student = await db.select().from(students).where(eq(students.userId, user[0]["userId"]));
  const input = {...student[0], ...user[0]};

  return (
    <>
        
      <StudentOverview {...input} />
    </>
  )
}

export default Page;
