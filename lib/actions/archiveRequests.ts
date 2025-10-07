"use server";

import { db } from "@/database/drizzle";
import requests from "@/database/schema/requests";
import { inArray } from "drizzle-orm";

export async function archiveRequests(requestIds: number[], archive = true) {
  if (!requestIds.length)
    return { success: false, message: "No request IDs provided" };

  try {
    await db
      .update(requests)
      .set({ isArchived: archive })
      .where(inArray(requests.id, requestIds));

    return { success: true, updated: requestIds.length };
  } catch (error) {
    console.error("Failed to update request archive status:", error);
    return { success: false, message: "Database update failed" };
  }
}

/**
 * Shortcut for unarchiving requests
 */
export async function unarchiveRequests(requestIds: number[]) {
  return archiveRequests(requestIds, false);
}
