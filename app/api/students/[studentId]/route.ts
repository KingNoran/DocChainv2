import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { students, subjects, record } from "@/database/schema";
import { subjectChecklists } from "@/app/constants/checklists";
import { auth } from "@/auth";

function mergeTranscript(baseChecklist: any, dbSubjects: any[]) {
  return Object.fromEntries(
    Object.entries(baseChecklist as Record<string, any>).map(([yearKey, yearData]) => [
      yearKey,
      Object.fromEntries(
        Object.entries(yearData).map(([semKey, semCourses]) => [
          semKey,
          (semCourses as any[]).map(course => {
            const match = dbSubjects.find(s => s.courseCode === course.courseCode);
            return {
              ...course,
              finalGrade: match?.finalGrade ?? course.finalGrade ?? 0,
              instructor: match?.instructor ?? course.instructor ?? "",
            };
          }),
        ])
      ),
    ])
  );
}

export async function GET(_request: NextRequest, { params }: { params: any }) {
  const session = await auth();

  if (!session || !["REGISTRAR", "ADMIN", "STUDENT"].includes(session.user?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const resolvedParams = await params;

  console.log("params.studentId:", resolvedParams.studentId);

  const studentId = parseInt(resolvedParams.studentId, 10);
  if (isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
  }

  console.log("studentId (parsed):", studentId);

  // Fetch student
  const student = await db.query.students.findFirst({ where: eq(students.studentId, studentId) });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  // If role is STUDENT, ensure they are only fetching their own record
  if (session.user.role === "STUDENT" && student.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch transcript
  const transcriptRecord = await db.query.record.findFirst({ where: eq(record.studentId, studentId) });
  if (!transcriptRecord) return NextResponse.json({ error: "Transcript record not found" }, { status: 404 });

  // Fetch subjects
  const dbSubjects = await db.query.subjects.findMany({ where: eq(subjects.transcriptId, transcriptRecord.id) });

  // Fetch checklist and merge
  const baseChecklist = subjectChecklists[student.course];
  if (!baseChecklist) return NextResponse.json({ error: `Checklist not found for course ${student.course}` }, { status: 400 });

  const mergedTranscript = mergeTranscript(baseChecklist, dbSubjects);

  return NextResponse.json({ student, transcript: mergedTranscript });
}
