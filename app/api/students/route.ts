import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { Student } from "@/components/registrar/table/students/columns";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();

  if (!session || !["REGISTRAR", "ADMIN", "STUDENT"].includes(session.user?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role === "STUDENT") {
      const student = await db
        .select({id: students.studentId})
        .from(students)
        .where(eq(students.userId, session.user.id))
        .limit(1)
  
        const { searchParams } = new URL(request.url);
        const studentIdParam = searchParams.get("studentId");
        if (!student.length || String(student[0].id) !== studentIdParam){
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }
    const { searchParams } = new URL(request.url);
    const studentIdParam = searchParams.get("studentId");

    if (studentIdParam) {
      const studentId = parseInt(studentIdParam, 10);
      if (isNaN(studentId)) {
        return NextResponse.json({ error: "Invalid studentId" }, { status: 400 });
      }
      // Fetch a single student by studentId
      const student: Student[] = await db
        .select({
          studentId: students.studentId,
          year: students.year,
          firstName: users.firstName,
          middleName: sql<string | undefined>`COALESCE(${users.middleName}, NULL)`,
          lastName: users.lastName,
          semester: students.semester,
          course: students.course,
          torReady: students.torReady,
          nationality: users.nationality,
          address: users.address,
          birthday: users.birthday,
          major: students.major,
          highschool: students.highschool,
          dateEntrance: students.dateEntrance,
          dateGraduated: students.dateGraduated,
          isArchived: users.isArchived
        })
        .from(students)
        .innerJoin(users, eq(users.userId, students.userId))
        .where(eq(students.studentId, studentId));

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }

      return NextResponse.json(student);
    } else {
      // Fetch all students
      const allStudents: Student[] = await db
        .select({
          studentId: students.studentId,
          year: students.year,
          firstName: users.firstName,
          middleName: sql<string | undefined>`COALESCE(${users.middleName}, NULL)`,
          lastName: users.lastName,
          semester: students.semester,
          course: students.course,
          torReady: students.torReady,
          nationality: users.nationality,
          address: users.address,
          birthday: users.birthday,
          major: students.major,
          highschool: students.highschool,
          dateEntrance: students.dateEntrance,
          dateGraduated: students.dateGraduated,
          isArchived: users.isArchived
        })
        .from(students)
        .innerJoin(users, eq(users.userId, students.userId))
        .where(eq(users.role, "STUDENT"));

      return NextResponse.json(allStudents);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch student(s)" },
      { status: 500 }
    );
  }
}

export async function POST(req : Request){
  
}
