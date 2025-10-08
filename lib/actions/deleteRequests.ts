"use server";

import { db } from "@/database/drizzle";
import { requests } from "@/database/schema";
import { inArray } from "drizzle-orm";

/**
 * Permanently deletes requests from the database.
 */
export async function deleteRequests(requestIds: number[]) {
  if (!requestIds.length)
    return { success: false, message: "No request IDs provided" };

  try {
    await db.delete(requests).where(inArray(requests.id, requestIds));

    return { success: true, deleted: requestIds.length };
  } catch (error) {
    console.error("Failed to delete requests:", error);
    return { success: false, message: "Database delete failed" };
  }
}
