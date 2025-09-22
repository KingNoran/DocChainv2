// lib/student.ts
"use server"

import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const getStudentData = async (email: string) => {
  const user = await db.select().from(users).where(eq(users.email, email));
  const student = await db
    .select()
    .from(students)
    .where(eq(students.userId, user[0].userId));

  return { ...student[0], ...user[0] };
}
