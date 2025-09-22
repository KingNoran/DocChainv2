import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const studentSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50),
    lastName: z.string().min(1).max(50),
    course: z.string().min(4).max(6),
    phone: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});

export const registrarStudentSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50),
    lastName: z.string().min(1).max(50),
    course: z.string().min(4).max(6),
    phone: z.string(),
    email: z.string().email(),
});

export const registrarSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50),
    lastName: z.string().min(1).max(50),
    phone: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});

export const adminSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50),
    lastName: z.string().min(1).max(50),
    phone: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});

export const creditUnit = z.object({
    lecture: z.number(),
    laboratory: z.number(),
});

export const TOR_subject = z.object({
    id: z.number(),
    courseCode: z.string(),
    courseTitle: z.string(),
    creditUnit: creditUnit,
    preRequisite: z.string(),
    finalGrade: z.number(),
    instructor: z.string(),
});

export const TOR_sem = z.array(TOR_subject);

export const TOR_year = z.object({
    firstSem: TOR_sem,
    secondSem: TOR_sem
});

export const TOR_midYear = z.object({
    midSem: TOR_sem,
});

export const TORSchema = z.object({
    firstYear : TOR_year,
    secondYear: TOR_year,
    midYear: TOR_midYear.optional(),
    midYear1: TOR_midYear.optional(),
    midYear2: TOR_midYear.optional(),
    thirdYear: TOR_year,
    fourthYear: TOR_year,
});

