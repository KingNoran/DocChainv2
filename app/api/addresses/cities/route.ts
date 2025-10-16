import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { cities } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const provinceCode = searchParams.get("provinceCode");

    const data = provinceCode
      ? await db
          .select()
          .from(cities)
          .where(eq(cities.province_code, provinceCode))
          .orderBy(cities.city_name)
      : await db
          .select()
          .from(cities)
          .orderBy(cities.city_name);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
