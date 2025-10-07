import { archiveRequests } from "./archiveRequests";

export async function validateRequests(ids: number[]) {
  if (!ids?.length) return;

  // First, validate the requests
  const res = await fetch("/api/requests/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Validation failed: ${error}`);
  }

  // After successful validation, archive them automatically
  await archiveRequests(ids);
}