// app/api/email/confirm/route.ts
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) return new Response(JSON.stringify({ error: "Token is required" }), { status: 400 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return new Response(JSON.stringify({ error: "Token expired" }), { status: 400 });
      }
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
    }

    const userId = decoded.userId;

    await db.update(users)
      .set({ emailVerified: true })
      .where(eq(users.userId, userId));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
