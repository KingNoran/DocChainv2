import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { requests, students } from "@/database/schema";
import { createStudent } from "@/lib/admin/actions/student";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  // Only Registrar or Admin can validate
  if (!session || !["REGISTRAR", "ADMIN"].includes(session.user?.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No request IDs provided" }, { status: 400 });
    }

    // Fetch the requests to process
    const targetRequests = await db
      .select()
      .from(requests)
      .where(inArray(requests.id, ids));

    if (!targetRequests.length) {
      return NextResponse.json({ error: "No matching requests found" }, { status: 404 });
    }

    await db.transaction(async (tx) => {
      for (const r of targetRequests) {
        const content = r.requestContent as any;
        const type = r.activity?.toLowerCase();

        console.log("Validating request:", r.id, "activity:", type);

        // 🧩 CREATE STUDENT
        if (type === "create") {
          // The content *is* the student info itself, not wrapped in userParams
          const userParams = {
            email: content.email,
            password: "default123", // 🔒 you can replace this or generate one
            firstName: content.firstName,
            middleName: content.middleName,
            lastName: content.lastName,
            phone: content.phone,
            address: content.address,
            birthday: content.birthday,
            nationality: content.nationality,
          };

          const courseValue = content.course;

          if (!userParams.email || !courseValue) {
            throw new Error(`Invalid create request: missing email or course`);
          }

          const result = await createStudent(userParams, courseValue);
          if (!result.success) {
            throw new Error(result.message || "Failed to create student");
          }
        }

        // ✅ FINALIZE (mark TOR ready)
        else if (type === "finalize") {
          const studentId = content.studentId;
          if (!studentId) throw new Error("Missing studentId for finalize request");

          const updated = await tx
            .update(students)
            .set({ torReady: true })
            .where(eq(students.studentId, studentId))
            .returning();

          if (!updated.length) {
            throw new Error(`Student not found or update failed for ID: ${studentId}`);
          }
        }

        // ❌ Unknown type
        else {
          throw new Error(`Unsupported request type: ${type}`);
        }

        // ✅ Mark request as validated + archived
        await tx
          .update(requests)
          .set({
            status: "APPROVED",
            validatedAt: new Date().toISOString(),
            validatorId: session.user.id,
            isArchived: true,
          })
          .where(eq(requests.id, r.id));
      }
    });

    return NextResponse.json({
      success: true,
      message: "Requests validated and archived successfully",
    });
  } catch (error: any) {
    console.error("Validation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to validate requests" },
      { status: 500 }
    );
  }
}
