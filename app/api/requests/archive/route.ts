
import { db } from "@/database/drizzle";
import { requests } from "@/database/schema";
import { eq, inArray } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: "No IDs provided" }), { status: 400 });
    }

    await db
      .update(requests)
      .set({ isArchived: true })
      .where(inArray(requests.id, ids));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
