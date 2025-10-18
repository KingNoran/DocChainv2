import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs"; // for hashing passwords
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, newPassword } = await req.json();
    if (!userId || !newPassword) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 10);

    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.userId, userId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
