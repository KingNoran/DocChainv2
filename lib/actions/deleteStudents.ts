"use server";

import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { inArray } from "drizzle-orm";

/**
 * Permanently deletes students (and optionally their linked users)
 */
export async function deleteStudents(studentIds: number[]) {
  if (!studentIds.length)
    return { success: false, message: "No student IDs provided" };

  try {
    // 1️⃣ Find userIds related to these students
    const result = await db
      .select({ userId: students.userId })
      .from(students)
      .where(inArray(students.studentId, studentIds));

    const userIds = result
      .map((r) => r.userId)
      .filter((id): id is string => typeof id === "string");

    // 2️⃣ Delete from `students` first (to avoid foreign key issues)
    await db.delete(students).where(inArray(students.studentId, studentIds));

    // 3️⃣ Optionally delete users (if you really want to remove accounts)
    if (userIds.length > 0) {
      await db.delete(users).where(inArray(users.userId, userIds));
    }

    return { success: true, deleted: studentIds.length };
  } catch (error) {
    console.error("Failed to delete students:", error);
    return { success: false, message: "Database delete failed" };
  }
}
