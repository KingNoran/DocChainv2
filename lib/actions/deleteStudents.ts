"use server";

import { db } from "@/database/drizzle";
import { students, users, record, semesters, subjects } from "@/database/schema";
import { inArray } from "drizzle-orm";

export async function deleteStudents(studentIds: number[]) {
  if (!studentIds.length)
    return { success: false, message: "No student IDs provided" };

  try {
    await db.transaction(async (tx) => {
      // 1️⃣ Find userIds related to these students
      const studentRecords = await tx
        .select({ studentId: students.studentId, userId: students.userId })
        .from(students)
        .where(inArray(students.studentId, studentIds));

      const userIds = studentRecords
        .map((r) => r.userId)
        .filter((id): id is string => typeof id === "string");

      const studentIdsToDelete = studentRecords.map((r) => r.studentId);

      if (studentIdsToDelete.length === 0) {
        throw new Error("No matching students found");
      }

      // 2️⃣ Find related TOR transcripts
      const torRecords = await tx
        .select({ id: record.id })
        .from(record)
        .where(inArray(record.studentId, studentIdsToDelete));

      const transcriptIds = torRecords.map((r) => r.id);

      // 3️⃣ Delete subjects
      if (transcriptIds.length > 0) {
        await tx.delete(subjects).where(inArray(subjects.transcriptId, transcriptIds));
      }

      // 4️⃣ Delete semesters
      if (transcriptIds.length > 0) {
        await tx.delete(semesters).where(inArray(semesters.transcriptId, transcriptIds));
      }

      // 5️⃣ Delete TOR transcripts
      if (transcriptIds.length > 0) {
        await tx.delete(record).where(inArray(record.id, transcriptIds));
      }

      // 6️⃣ Delete students
      await tx.delete(students).where(inArray(students.studentId, studentIdsToDelete));

      // 7️⃣ Optionally delete users
      if (userIds.length > 0) {
        await tx.delete(users).where(inArray(users.userId, userIds));
      }
    });

    return { success: true, deleted: studentIds.length };
  } catch (error) {
    console.error("Failed to delete students and related data:", error);
    return { success: false, message: "Database delete failed" };
  }
}
