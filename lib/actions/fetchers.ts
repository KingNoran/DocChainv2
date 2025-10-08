export async function fetchStudents(archived?: boolean) {
  const query = archived !== undefined ? `?archived=${archived}` : "";
  const res = await fetch(`/api/students${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}

export async function fetchRequests(archived?: boolean) {
  const query = archived !== undefined ? `?archived=${archived}` : "";
  const res = await fetch(`/api/requests${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
}
