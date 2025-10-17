"use server";

import { RegistrarUserParams } from "@/app/student/types";
import { db } from "@/database/drizzle";
import { registrars, requests } from "@/database/schema";
import { eq, or, sql } from 'drizzle-orm';
import { Session } from "next-auth";

type RequestType = "create" | "update" | "requestTor";

export const sendRequest = async (
    userparams: RegistrarUserParams, 
    session: Session,
    type: RequestType
) => {
    try {
        // Check if request already exists
        const existingRequest = await db
            .select()
            .from(requests)
            .where(or(
                eq(sql`${requests.requestContent}->>'email'`, userparams.email),
                eq(sql`${requests.requestContent}->>'phone'`, userparams.phone)
            ))
        if(existingRequest.length > 0) return{success: false, error: "Request already exists" }
        
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
