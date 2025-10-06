
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { requests } from "@/database/schema";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session || !["REGISTRAR", "ADMIN"].includes(session.user?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await db.select().from(requests);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}