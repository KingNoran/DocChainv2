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
    const { newEmail } = body;

    if (!newEmail) return NextResponse.json({ error: "New email is required" }, { status: 400 });

    // Optionally: check if newEmail is already in use
    const existing = await db.select().from(users).where(eq(users.email, newEmail)).limit(1);
    if (existing.length > 0) return NextResponse.json({ error: "Email already in use" }, { status: 400 });

    const token = jwt.sign(
      { userId: session.user.id, newEmail },
      process.env.EMAIL_VERIFICATION_SECRET!,
      { expiresIn: "1h" }
    );

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/student/confirm-email-change?token=${token}`;

    return NextResponse.json({ verificationLink });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
