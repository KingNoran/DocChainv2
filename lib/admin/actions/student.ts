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
        console.warn("⚠️ Skipping row without email:", record);
        continue;
      }

      const normalizedRecord = {
        ...record,
        birthday: new Date(record.birthday),
        dateEntrance: new Date(record.dateEntrance),
      };

      // 1️⃣ Check if user exists
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedRecord.email))
        .limit(1);

      let userId: string;
      let userRow;

      if (existingUsers.length > 0) {
        userRow = existingUsers[0];
        userId = userRow.userId;
        console.log(`⚠️ User already exists: ${normalizedRecord.email}`);
      } else {
        // 2️⃣ Create user
        const newPassword = `${normalizedRecord.lastName}${normalizedRecord.firstName}`;
        const hashedPassword = await hash(newPassword, 10);

        const [newUser] = await db
          .insert(users)
          .values({
            role: "STUDENT",
            firstName: normalizedRecord.firstName,
            middleName: normalizedRecord.middleName ?? "",
            lastName: normalizedRecord.lastName,
            email: normalizedRecord.email,
            phone: normalizedRecord.phone,
            nationality: normalizedRecord.nationality ?? "Filipino",
            birthday: formatDateForSQL(normalizedRecord.birthday)!, // 👈 string form
            address: normalizedRecord.address,
            password: hashedPassword,
          })
          .returning();

        console.log("✅ Created new user:", newUser.userId);
        userId = newUser.userId;
        userRow = newUser;
      }

      // 3️⃣ Check if student exists for this user
      const existingStudents = await db
        .select()
        .from(students)
        .where(eq(students.userId, userId))
        .limit(1);

      let studentRow;

      if (existingStudents.length > 0) {
        studentRow = existingStudents[0];
        console.log(`⚠️ Student already exists for user: ${normalizedRecord.email}`);
      } else {
        // 4️⃣ Create student record
        const [newStudent] = await db
          .insert(students)
          .values({
            highschool: normalizedRecord.highschool,
            dateEntrance: normalizedRecord.dateEntrance,
            userId,
            course: (normalizedRecord.course as course) ?? "BSCS",
            torHash: "",
          })
          .returning();

        console.log("✅ Created new student:", newStudent.studentId);
        studentRow = newStudent;
      }

      // 5️⃣ Ensure TOR exists (always runs)
      const studentObj: Student = {
        course: studentRow.course,
        nationality: userRow.nationality,
        address: userRow.address,
        birthday: new Date(userRow.birthday),
        highschool: studentRow.highschool,
        dateEntrance: studentRow.dateEntrance,
        dateGraduated: new Date(studentRow.dateGraduated ?? ""),
        studentId: studentRow.studentId,
        userId,
        year: 0,
        semester: 0,
        finalGrade: "",
        torReady: false,
        major: studentRow.major ?? null,
      };

      const torResult = await createTOR(studentObj);
      if (!torResult.success) {
        console.error(`❌ TOR creation failed for student ${studentObj.studentId}: ${torResult.message}`);
      } else {
        console.log(`✅ TOR created for student ${studentObj.studentId}`);
      }

      successCount++;
    }

    return { success: true, count: successCount };
  } catch (error) {
    console.error("💥 [createStudentsBulk] Error:", error);
    return { success: false, message: "Bulk student insert failed." };
  }
};

