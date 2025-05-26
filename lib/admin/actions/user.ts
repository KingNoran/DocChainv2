"use server";

import { course, roles, StudentParams, TORParams, UserParams } from "@/app/(root)/types";
import { db } from "@/database/drizzle";
import { admins, record, registrars, students, users } from "@/database/schema";
import { error } from "console";
import { eq } from 'drizzle-orm';

export const createUser = async (
    userparams: UserParams, 
    studentparams?: StudentParams
)=>{
    try{
        const newUser = await db.insert(users).values({
            ...userparams,
        }).returning();

        const role = userparams.role;

        if(role === "STUDENT"){
            await db.insert(students).values({
                userId: newUser[0].userId,
                course: studentparams!.course as course,
                year: studentparams!.year,
                semester: studentparams!.semester,
                torReady: studentparams!.torReady
            });
        } else if (role === "ADMIN"){
            await db.insert(admins).values({
                userId: newUser[0].userId,
            })
        } else if (role === "REGISTRAR"){
            await db.insert(registrars).values({
                userId: newUser[0].userId,
            })
        } else {
            throw error;
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newUser[0])),
        }
    } catch(error){
        console.group(error);

        return{
            success: false,
            message: "Error occurred while making User"
        }
    }
}

export const createTOR = async(
    torParams: TORParams
)=>{
    try{
        const student = await db
        .select()
        .from(students)
        .where(eq(students.studentId, torParams.studentId!))
        .limit(1);
        
        /* const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, student[0].userId!))
        .limit(1); */

        const course = student[0].course;

        const newTOR = await db.insert(record).values({
            ...torParams
        }).returning();

        return{
            success: true,
            data: JSON.parse(JSON.stringify(newTOR[0])),
        }
    } catch(error){
        console.group(error);
        return{
            success: false,
            message: "Error occurred while making TOR"
        }
    }
}