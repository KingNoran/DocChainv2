import { archiveRequests } from "./archiveRequests";

export async function validateRequests(ids: number[]) {
  if (!ids?.length) return { success: false, message: "No request IDs provided" };

  // First, validate the requests
  const res = await fetch("/api/requests/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  // Parse JSON safely
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      `Validation failed: ${data?.error || res.statusText || "Unknown error"}`
    );
  }

  // After successful validation, archive them automatically
  await archiveRequests(ids);

  // ✅ Return the parsed success response
  return data; // Example: { success: true, message: "Requests validated and archived successfully" }
}
