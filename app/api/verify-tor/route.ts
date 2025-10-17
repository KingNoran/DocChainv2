import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/database/drizzle";
import { users, students, record, subjects } from "@/database/schema";
import { subjectChecklists } from "@/app/constants/checklists";
import { auth } from "@/auth";

const VerifyTORSchema = z.object({
  studentUUID: z.string().uuid(),
});

// Utility: merge DB subjects into the checklist
function mergeTranscript(baseChecklist: any, dbSubjects: any[]) {
  const merged: any = {};

  for (const yearKey in baseChecklist) {
    merged[yearKey] = {};
    for (const semKey in baseChecklist[yearKey]) {
      merged[yearKey][semKey] = baseChecklist[yearKey][semKey].map((course: any) => {
        const match = dbSubjects.find((s) => s.courseCode === course.courseCode);
        return {
          ...course,
          finalGrade: match?.finalGrade ?? course.finalGrade ?? 0,
          instructor: match?.instructor ?? course.instructor ?? "",
        };
      });
    }
  }

  return merged;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
        
    if (!session || !["REGISTRAR", "ADMIN", "STUDENT"].includes(session.user?.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentUUID } = VerifyTORSchema.parse(body);

    // 1️⃣ Find user by UUID
    const user = await db.query.users.findFirst({
      where: eq(users.userId, studentUUID),
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: "No user found for this UUID." },
        { status: 404 }
      );
    }

    // 2️⃣ Find linked student record
    const student = await db.query.students.findFirst({
      where: eq(students.userId, user.userId),
    });

    if (!student) {
      return NextResponse.json(
        { valid: false, error: "No student record found for this user." },
        { status: 404 }
      );
    }

    // 3️⃣ Find transcript record
    const transcriptRecord = await db.query.record.findFirst({
      where: eq(record.studentId, student.studentId),
    });

    if (!transcriptRecord) {
      return NextResponse.json(
        { valid: false, error: "Transcript record not found." },
        { status: 404 }
      );
    }

    // 4️⃣ Find all subjects for that transcript
    const dbSubjectsList = await db.query.subjects.findMany({
      where: eq(subjects.transcriptId, transcriptRecord.id),
    });

    // 5️⃣ Get checklist for student’s course
    const baseChecklist = subjectChecklists[student.course];
    if (!baseChecklist) {
      return NextResponse.json(
        { valid: false, error: `Checklist not found for course ${student.course}` },
        { status: 400 }
      );
    }

    // 6️⃣ Merge transcript
    const mergedTranscript = mergeTranscript(baseChecklist, dbSubjectsList);

    // ✅ Return everything
    return NextResponse.json({
      valid: true,
      student,
      transcript: mergedTranscript,
    });
  } catch (error) {
    console.error("Error verifying TOR:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { valid: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { valid: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
