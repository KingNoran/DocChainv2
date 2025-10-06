import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { students, subjects, record } from "@/database/schema";
import { subjectChecklists } from "@/app/constants/checklists";
import { auth } from "@/auth";

// Merge DB values into checklist
function mergeTranscript(baseChecklist: any, dbSubjects: any[]) {
  const mergedChecklist: any = {};

  for (const yearKey in baseChecklist) {
    mergedChecklist[yearKey] = {};

    for (const semKey in baseChecklist[yearKey]) {
      const semCourses = baseChecklist[yearKey][semKey];

      mergedChecklist[yearKey][semKey] = semCourses.map((course: any) => {
        const match = dbSubjects.find(
          (subj) => subj.courseCode === course.courseCode
        );

        return {
          ...course,
          finalGrade: match?.finalGrade ?? course.finalGrade ?? 0,
          instructor: match?.instructor ?? course.instructor ?? "",
        };
      });
    }
  }

  return mergedChecklist;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const session = await auth();

  if (!session || !["REGISTRAR", "ADMIN"].includes(session.user?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const studentId = parseInt(params.studentId, 10);
    if (isNaN(studentId)) {
      return NextResponse.json(
        { error: "Invalid student ID" },
        { status: 400 }
      );
    }

  // 1. Get this specific student
  const student = await db.query.students.findFirst({
    where: eq(students.studentId, studentId),
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // 2. Get their transcript record
  const transcriptRecord = await db.query.record.findFirst({
    where: eq(record.studentId, studentId),
  });

  if (!transcriptRecord) {
    return NextResponse.json(
      { error: "Transcript record not found" },
      { status: 404 }
    );
  }

  // 3. Get all subjects for that transcript
  const dbSubjects = await db.query.subjects.findMany({
    where: eq(subjects.transcriptId, transcriptRecord.id),
  });

  // 4. Get the checklist for this student’s course
  const baseChecklist = subjectChecklists[student.course];
  if (!baseChecklist) {
    return NextResponse.json(
      { error: `Checklist not found for course ${student.course}` },
      { status: 400 }
    );
  }

  // 5. Merge DB transcript values into the checklist
  const mergedTranscript = mergeTranscript(baseChecklist, dbSubjects);

  // 6. Return result
  return NextResponse.json({
    student,
    transcript: mergedTranscript,
  });
}
