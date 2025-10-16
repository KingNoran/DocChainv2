import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { barangays } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cityCode = searchParams.get("cityCode");

    const data = cityCode
      ? await db
          .select()
          .from(barangays)
          .where(eq(barangays.city_code, cityCode))
          .orderBy(barangays.brgy_name)
      : await db
          .select()
          .from(barangays)
          .orderBy(barangays.brgy_name);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching barangays:", error);
    return NextResponse.json({ error: "Failed to fetch barangays" }, { status: 500 });
  }
}
