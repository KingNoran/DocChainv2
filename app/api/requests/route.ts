import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { requests, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  // ✅ Authorization check
  if (!session || !["REGISTRAR", "ADMIN"].includes(session.user?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const archived = searchParams.get("archived");

    const isArchived =
      archived === "true"
        ? true
        : archived === "false"
        ? false
        : undefined;

    // ✅ Create an alias for the validator users table
    const validatorUser = alias(users, "validator_user");

let query;

if (isArchived !== undefined) {
  query = db
    .select({
      id: requests.id,
      requestContent: requests.requestContent,
      requesterId: requests.requesterId,
      requesterFirstName: users.firstName,
      requesterLastName: users.lastName,
      validatorId: requests.validatorId,
      validatorFirstName: validatorUser.firstName,
      validatorLastName: validatorUser.lastName,
      activity: requests.activity,
      status: requests.status,
      isArchived: requests.isArchived,
      createdAt: requests.createdAt,
      validatedAt: requests.validatedAt,
    })
    .from(requests)
    .where(eq(requests.isArchived, isArchived))
    .leftJoin(users, eq(users.userId, requests.requesterId))
    .leftJoin(validatorUser, eq(validatorUser.userId, requests.validatorId));
} else {
  query = db
    .select({
      id: requests.id,
      requestContent: requests.requestContent,
      requesterId: requests.requesterId,
      requesterFirstName: users.firstName,
      requesterLastName: users.lastName,
      validatorId: requests.validatorId,
      validatorFirstName: validatorUser.firstName,
      validatorLastName: validatorUser.lastName,
      activity: requests.activity,
      status: requests.status,
      isArchived: requests.isArchived,
      createdAt: requests.createdAt,
      validatedAt: requests.validatedAt,
    })
    .from(requests)
    .leftJoin(users, eq(users.userId, requests.requesterId))
    .leftJoin(validatorUser, eq(validatorUser.userId, requests.validatorId));
}

const result = await query;


    // ✅ Format the names
    const formatted = result.map((r) => ({
      ...r,
      requesterName: `${r.requesterFirstName ?? ""} ${r.requesterLastName ?? ""}`.trim() || "Unknown",
      validatorName: r.validatorFirstName
        ? `${r.validatorFirstName} ${r.validatorLastName ?? ""}`.trim()
        : null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
