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
        // Check if user exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, userparams.email))
            .limit(1);

        if (existingUser.length > 0) {
            return { success: false, error: "User already exists" };
        }

        if (!userparams.password) {
            return { success: false, message: "Password is required" };
        }

        const hashedPassword = await hash(userparams.password, 10);

        // Create new User
        const [newUser] = await db.insert(users).values({
            ...userparams,
            password: hashedPassword,
        }).returning();

        // Create new Student
        const [newStudent] = await db.insert(students).values({
            userId: newUser.userId,
            course: courseValue as course ?? "BSCS"
        }).returning({ studentId: students.studentId, course: students.course });

        // Create new TOR
        const newTOR = await createTOR(newStudent as Student);
        if (!newTOR.success) {
            return { success: false, message: `Failed to create TOR: ${newTOR.message}` };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newStudent))
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error occurred while making Student"
        };
    }
};
