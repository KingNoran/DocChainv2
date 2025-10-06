// app/api/users/route.ts
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { gt } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session || !["REGISTRAR", "ADMIN"].includes(session.user?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await db.select().from(users);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function getUsersWithStatus() {
  const allUsers = await db.select().from(users)
  const cutoff = Date.now() - 5 * 60 * 1000 // 5 minutes ago

  return allUsers.map((u) => ({
    ...u,
    isActive: u.active && u.lastActivityDate.getTime() > cutoff,
  }))
}