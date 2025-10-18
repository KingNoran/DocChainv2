import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
      if (!session || !["REGISTRAR", "ADMIN", "STUDENT"].includes(session.user?.role || "")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
    const body = await req.json();
    const { email } = body;

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userResult.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userData = userResult[0];

    const token = jwt.sign(
      { userId: userData.userId },
      process.env.EMAIL_VERIFICATION_SECRET!,
      { expiresIn: "1h" }
    );
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/student/confirm-email?token=${token}`;

    return NextResponse.json({ verificationLink });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
