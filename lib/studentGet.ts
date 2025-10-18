// lib/student.ts
"use server"

import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const getStudentData = async (userId: string) => {
  const student = await db
    .select({studentId: students.studentId})
    .from(students)
    .where(eq(students.userId, userId));

  return student[0];
}
