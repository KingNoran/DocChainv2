"use server";

import { AuthCredentials } from "@/app/(root)/types";
import { signIn } from "@/auth";
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