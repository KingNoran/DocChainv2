import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const userSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50),
    lastName: z.string().min(1).max(50),
    phone: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.string(),
});

export const studentSchema = z.object({
    year: z.number(),
    semester: z.number(),
    course: z.string().nonempty(),
    finalGrade: z.number(),
    torReady: z.boolean(),
});