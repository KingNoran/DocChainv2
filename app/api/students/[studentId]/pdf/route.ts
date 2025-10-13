import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { subjects } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: any }) {
  const body = await req.json(); // array of grades
  const resolvedParams = await params;
  const studentId = parseInt(resolvedParams.studentId, 10);

  if (isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
  }

  try {
    for (const grade of body) {
      const [year, semester, courseCode] = grade.gradeKey.split("-");

      // Update the corresponding subject in DB
      await db.update(subjects)
        .set({
          finalGrade: grade.finalRating,
          instructor: grade.instructor,
        })
        .where(eq(subjects.courseCode, courseCode)); 
        // optionally: add transcriptId filtering if multiple transcripts exist
    }

    return NextResponse.json({ success: true, message: "Transcript updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update transcript" }, { status: 500 });
  }
}
