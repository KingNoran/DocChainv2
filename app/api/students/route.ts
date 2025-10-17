import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !["REGISTRAR", "ADMIN", "STUDENT"].includes(session.user?.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const archivedParam = searchParams.get("archived");
    const isArchived =
      archivedParam === "true" ? true :
      archivedParam === "false" ? false :
      undefined;

    const studentIdParam = searchParams.get("studentId");

    // Build the WHERE conditions dynamically
    const conditions = [eq(users.role, "STUDENT")];
    if (isArchived !== undefined) {
      conditions.push(eq(users.isArchived, isArchived));
    }
    if (studentIdParam) {
      conditions.push(eq(students.studentId, Number(studentIdParam)));
    }

    const data = await db
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
        isArchived: users.isArchived,
        email: users.email,
        emailVerified: users.emailVerified,
        isTorVerified: students.torReady,
        torHash: students.torHash
      })
      .from(students)
      .innerJoin(users, eq(users.userId, students.userId))
      .where(and(...conditions));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
