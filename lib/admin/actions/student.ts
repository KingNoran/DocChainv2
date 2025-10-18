"use server";

import { course, Student, StudentParams, UserParams } from "@/app/student/types";
import { db } from "@/database/drizzle";
import { students, users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from 'drizzle-orm';
import { createTOR } from "../TOR/tor";

function formatDateForSQL(date: Date | string | null): string | null {
  if (!date) return null;

  // Convert string to Date if necessary
  const d = date instanceof Date ? date : new Date(date);

  // Check if valid date
  if (isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

interface StudentInputs{
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  birthday: Date;
  address:string;

  course: course;
  torHash: string;
  major: string;
  highschool: string;
  dateEntrance: Date;
}

export const createStudent = async (
  userparams: StudentInputs,
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
    const UserInputs = {
      role: "STUDENT",
      password: userparams.password,
      firstName: userparams.firstName,
      middleName: userparams.middleName,
      lastName: userparams.lastName,
      email: userparams.email,
      phone: userparams.phone,
      nationality: userparams.nationality,
      birthday: userparams.birthday,
      address: userparams.address
    }

    // Create new User
    const [newUser] = await db
      .insert(users)
      .values({
        role: "STUDENT",
        firstName: userparams.firstName,
        middleName: userparams.middleName,
        lastName: userparams.lastName,
        email: userparams.email,
        phone: userparams.phone,
        nationality: userparams.nationality,
        birthday: formatDateForSQL(userparams.birthday)!,
        address: userparams.address,
        password: hashedPassword,
      })
      .returning();

    console.log("✅ [createStudent] New user created:", newUser.userId);

    // Create new Student
    const [newStudent] = await db
      .insert(students)
      .values({
        ...userparams,
        userId: newUser.userId,
        course: (courseValue as course) ?? "BSCS",
      })
      .returning({
        studentId: students.studentId,
        course: students.course,
        userId: students.userId
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

export const createStudentsBulk = async (records: StudentInputs[]) => {
  try {
    let successCount = 0;

    for (const record of records) {
      if (!record.email) {
        console.warn("Skipping row without email:", record);
        continue; // skip this row
      }

      // Check if user already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, record.email))
        .limit(1);

      if (existing.length > 0) continue; // Skip duplicates
      const newPassword = `${record.lastName}${record.firstName}`
      const hashedPassword = await hash(newPassword, 10);

      // Insert User
      const [newUser] = await db.insert(users).values({
      role: "STUDENT",
      firstName: record.firstName,
      middleName: record.middleName,
      lastName: record.lastName,
      email: record.email,
      phone: record.phone,
      nationality: record.nationality,
      birthday: formatDateForSQL(record.birthday)!,
      address: record.address,
      password: hashedPassword,
    }).returning();

      // Insert Student
      const [newStudent] = await db
        .insert(students)
        .values({
          highschool: record.highschool,
          dateEntrance: record.dateEntrance,
          userId: newUser.userId,
          course: (record.course as course) ?? "BSCS",
          torHash: ""
        })
        .returning();

      const Student : Student = {
        course: newStudent.course,
        nationality: newUser.nationality,
        address: newUser.address,
        birthday: new Date(newUser.birthday),
        highschool: newStudent.highschool,
        dateEntrance: newStudent.dateEntrance,
        dateGraduated: null,
        studentId: 0,
        userId: "",
        year: 0,
        semester: 0,
        finalGrade: "",
        torReady: false,
        major: null
      }

      // Create TOR per student
      await createTOR(Student);
      successCount++;
    }

    return { success: true, count: successCount };
  } catch (error) {
    console.error("💥 [createStudentsBulk] Error:", error);
    return { success: false, message: "Bulk student insert failed." };
  }
};
