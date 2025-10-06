"use server";

import { course, roles, StudentParams, UserParams } from "@/app/student/types";
import { db } from "@/database/drizzle";
import { registrars, students, users } from "@/database/schema";
import { hash } from "bcryptjs";
import { error } from "console";
import { eq } from 'drizzle-orm';

export const createRegistrar = async (
    userparams: UserParams, 
)=>{
    try{
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, userparams.email))
            .limit(1)
        
        if(existingUser.length > 0){
            return {success: false, error: "User already exists"}
        }

        const hashedPassword = await hash(userparams.password, 10);
                
        const newRegistrar = await db.insert(users).values({
            ...userparams,
            role: "REGISTRAR",
            password: hashedPassword
        }).returning();

        await db.insert(registrars).values({
                userId: newRegistrar[0].userId,
            });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newRegistrar[0])),
        }


    } catch(error){
        console.group(error);

        return{
            success: false,
            message: "Error occurred while making User"
        }
    }
}