"use server";

import { AuthCredentials, roles } from "@/app/(root)/types";
import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { admins, registrars, students, users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";

export const signInWithCredentials = async (
    params: Pick<AuthCredentials, "email" | "password">
)=>{
    const { email, password } = params;

    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if(!success) return redirect("/too-fast");

    try{
        const result = await signIn("credentials",{
            email, 
            password, 
            redirect: false,
        });

        if (result?.error){
            return { success: false, error: result.error }
        }

        return { success: true };

    }catch(error){
        console.log(error, "Sign In error");
        return {success: false, error: "Sign In error"};
    }
};



export const signUp = async(params: AuthCredentials)=>{
    const {firstName, middleName, lastName, email, password, role} = params;

    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if(!success) return redirect("/too-fast");

    const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

    if(existingUser.length > 0){
        return {success: false, error: "User already exists"};
    }

    const hashedPassword = await hash(password, 10);

    const userRole = (role: string)=>{
        if(role==="STUDENT") return "STUDENT";
        if(role==="REGISTRAR") return "REGISTRAR";
        if(role==="ADMIN") return "ADMIN";
    }

    try{
        await db.insert(users).values({
            firstName,
            middleName,
            lastName,
            email,
            password : hashedPassword,
            phone: " ",
            role: userRole(role)
        })

        const user = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

        if(role === "STUDENT"){
            await db.insert(students).values({
                userId: user[0].userId,
                year: 1,
                semester: 1,
                course: "BSCS",
                finalGrade: "0",
                torReady: false
            })
        } else if (role === "REGISTRAR"){
            await db.insert(registrars).values({
                userId: user[0].userId,
            });
        } else if (role === "ADMIN"){
            await db.insert(admins).values({
                userId: user[0].userId,
            });
        }

        await signInWithCredentials({ email, password });

        return { success: true };
    }catch(error){
        console.log(error, "Log In Error");
        return {success: false, error: "Log In Error"};
    }
}
