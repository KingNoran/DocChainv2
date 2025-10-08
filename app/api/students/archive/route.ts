import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { eq, inArray } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: "No student IDs provided" }), { status: 400 });
    }

    // 1️⃣ Find userIds tied to those students
    const found = await db
      .select({ userId: students.userId })
      .from(students)
      .where(inArray(students.studentId, ids));

    const userIds = found
      .map((f) => f.userId)
      .filter((id): id is string => id !== null);

    // 2️⃣ Archive users
    await db
      .update(users)
      .set({ isArchived: true })
      .where(inArray(users.userId, userIds));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
