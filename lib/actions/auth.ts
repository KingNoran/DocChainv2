"use server";

import { AuthCredentials } from "@/app/student/types";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { error } from "console";

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
            return { success: false, error: result.error, status: 401, url: null }
        }

        const isArchived = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!isArchived.length || isArchived[0].isArchived) {
            console.log("Archived or User Not Found");
            return { success: false, error: Error("Archived Account or User Not Found"), status: 401, url: null };
        }

        await db
        .update(users)
        .set({ active: true, lastActivityDate: new Date() })
        .where(eq(users.email, email))

        return { success: true };

    }catch(error){
        console.log(error, "Sign In error");
        return {success: false, error: "Sign In error"};
    }
};

export const handleLogout = async () => {
  await signOut({ redirect: false });
  window.location.href = "/"; 
};