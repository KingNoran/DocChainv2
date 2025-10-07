import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { requests } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !["REGISTRAR", "ADMIN"].includes(session.user?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const archived = searchParams.get("archived");

    const isArchived =
      archived === "true"
        ? true
        : archived === "false"
        ? false
        : undefined;

    const query = isArchived !== undefined
      ? db.select().from(requests).where(eq(requests.isArchived, isArchived))
      : db.select().from(requests);

    const data = await query;
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
