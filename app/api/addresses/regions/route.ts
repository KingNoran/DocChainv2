// app/api/addresses/regions/route.ts
import { db } from "@/database/drizzle";
import { regions } from "@/database/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(regions).orderBy(regions.region_name);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return NextResponse.json({ error: "Failed to fetch regions" }, { status: 500 });
  }
}
