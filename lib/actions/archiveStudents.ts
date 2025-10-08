"use server";

import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { inArray } from "drizzle-orm";

export async function archiveStudents(studentIds: number[], archive = true) {
  if (!studentIds.length) return { success: false, message: "No student IDs provided" };

  try {
    // 1️⃣ Get the user IDs corresponding to the student IDs
    const result = await db
      .select({ userId: students.userId })
      .from(students)
      .where(inArray(students.studentId, studentIds));

    const userIds = result
      .map((r) => r.userId)
      .filter((id): id is string => typeof id === "string");

    if (userIds.length === 0) {
      return { success: false, message: "No matching users found" };
    }

    // 2️⃣ Update `users` archive status for those user IDs
    await db
      .update(users)
      .set({ isArchived: archive })
      .where(inArray(users.userId, userIds));

    return { success: true, updated: userIds.length };
  } catch (error) {
    console.error("Failed to update student archive status:", error);
    return { success: false, message: "Database update failed" };
  }
}

export async function unarchiveStudents(studentIds: number[]) {
  return archiveStudents(studentIds, false);
}