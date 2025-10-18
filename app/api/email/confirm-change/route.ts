// app/api/email/confirm-change/route.ts
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;
    if (!token) return NextResponse.json({ error: "Token is required" }, { status: 400 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json({ error: "Token expired" }, { status: 400 });
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const { userId, newEmail } = decoded;

    console.log(`userId: ${userId}`);
    console.log(`newEmail: ${newEmail}`);

    // Update email and mark verified
    await db.update(users)
      .set({ email: newEmail, emailVerified: true })
      .where(eq(users.userId, userId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
