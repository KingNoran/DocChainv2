import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(3).nonempty(),
    middleName: z.string().optional(),
    lastName: z.string().min(3).nonempty(),
    email: z.string().email(),
    role: z.string().nonempty(),
    tor: z.boolean(),
    password: z.string().min(8),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});