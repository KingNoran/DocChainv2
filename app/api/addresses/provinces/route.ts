import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { provinces } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const regionCode = searchParams.get("regionCode");

    const data = regionCode
      ? await db
          .select()
          .from(provinces)
          .where(eq(provinces.region_code, regionCode))
          .orderBy(provinces.province_name)
      : await db
          .select()
          .from(provinces)
          .orderBy(provinces.province_name);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return NextResponse.json({ error: "Failed to fetch provinces" }, { status: 500 });
  }
}
