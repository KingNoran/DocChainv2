"use server";

import { course, Student, StudentParams, UserParams } from "@/app/student/types";
import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from 'drizzle-orm';
import { createTOR } from "../TOR/tor";

export const createStudent = async (
  userparams: UserParams,
  courseValue: course
) => {
  try {
    console.log("🧩 [createStudent] Starting with:", { userparams, courseValue });

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userparams.email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("⚠️ [createStudent] User already exists:", userparams.email);
      return { success: false, error: "User already exists" };
    }

    if (!userparams.password) {
      console.log("⚠️ [createStudent] Missing password");
      return { success: false, message: "Password is required" };
    }

    const hashedPassword = await hash(userparams.password, 10);

    // Create new User
    const [newUser] = await db
      .insert(users)
      .values({
        ...userparams,
        password: hashedPassword,
      })
      .returning();

    console.log("✅ [createStudent] New user created:", newUser.userId);

    // Create new Student
    const [newStudent] = await db
      .insert(students)
      .values({
        userId: newUser.userId,
        course: (courseValue as course) ?? "BSCS",
      })
      .returning({
        studentId: students.studentId,
        course: students.course,
      });

    console.log("✅ [createStudent] New student created:", newStudent);

    // Create new TOR
    const newTOR = await createTOR(newStudent as Student);
    if (!newTOR.success) {
      console.log("❌ [createStudent] TOR creation failed:", newTOR.message);
      return { success: false, message: `Failed to create TOR: ${newTOR.message}` };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newStudent)),
    };
  } catch (error) {
    console.error("💥 [createStudent] Fatal error:", error);
    return {
      success: false,
      message: "Error occurred while making Student",
    };
  }
};
