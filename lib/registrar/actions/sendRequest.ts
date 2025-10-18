"use server";

import { RegistrarUserParams } from "@/app/student/types";
import { db } from "@/database/drizzle";
import { registrars, requests, students } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { Session } from "next-auth";

type RequestType = "create" | "update" | "requestTor" | "finalizeTor";

export const sendRequest = async (
  userparams: RegistrarUserParams | {}, 
  session: Session,
  type: RequestType
) => {
  try {
    let requesterId: string;

    // Determine requesterId based on role
    if (session.user.role === "REGISTRAR") {
      const registrar = await db
        .select()
        .from(registrars)
        .where(eq(registrars.userId, session.user.id))
        .limit(1);
      if (registrar.length === 0) throw new Error("Registrar does not exist");
      requesterId = registrar[0].userId!;
    } else if (session.user.role === "STUDENT") {
      const student = await db
        .select()
        .from(students)
        .where(eq(students.userId, session.user.id))
        .limit(1);
      if (student.length === 0) throw new Error("Student does not exist");
      requesterId = student[0].userId!;
    } else {
      throw new Error("Invalid user role");
    }

    // Check for duplicate pending request for this activity
    const existingRequest = await db
      .select()
      .from(requests)
      .where(and(
        eq(requests.requesterId, requesterId),
        eq(requests.activity, type),
        eq(requests.status, "PENDING"), // only consider pending requests
        eq(requests.isArchived, false)
      ));

    if (existingRequest.length > 0) {
      return { success: false, error: "You already have a pending request for this action" };
    }

    // Insert new request
    const newRequest = await db
      .insert(requests)
      .values({
        requesterId,
        requestContent: session.user.role === "REGISTRAR" ? userparams : {},
        activity: type
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newRequest))
    };

  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Error occurred while making request"
    };
  }
};
