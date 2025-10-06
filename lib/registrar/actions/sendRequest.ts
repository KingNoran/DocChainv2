"use server";

import { course, RegistrarUserParams } from "@/app/(root)/types";
import { db } from "@/database/drizzle";
import { registrars, requests, users } from "@/database/schema";
import { eq, or, sql } from 'drizzle-orm';
import { Session } from "next-auth";

type RequestType = "create" | "update";

export const sendRequest = async (
    userparams: RegistrarUserParams, 
    courseValue: course,
    session: Session,
    type: RequestType
) => {
    try {
        // Check if request already exists
        const existingUser = await db
            .select()
            .from(requests)
            .where(or(
                eq(sql`${requests.requestContent}->>'email'`, userparams.email),
                eq(sql`${requests.requestContent}->>'phone'`, userparams.phone)
            ))
        if(existingUser.length > 0) return{success: false, error: "Phone or Email already exists" }
        
        // Get Registrar id
        const registrarID = await db
            .select()
            .from(registrars)
            .where(eq(registrars.userId, session.user.id))
            .limit(1);

        const newRequest = await db
            .insert(requests)
            .values({
                requesterId: registrarID[0].userId!,
                requestContent: userparams,
                activity: type
            })

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newRequest))
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error occurred while making Student"
        };
    }
    
};
