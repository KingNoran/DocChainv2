import { NextResponse } from 'next/server';
import { db } from "@/database/drizzle";
import { students } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";


export const POST = async (req: Request) => {
    const session = await auth();
    const { studentId } = await req.json();
        
    if (!session || !["REGISTRAR", "ADMIN"].includes(session.user?.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await db
        .update(students)
        .set({
          torHash: "",
          torReady: false,
        })
        .where(eq(students.studentId, studentId));
  
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error }, { status: 404 });
    }
}
