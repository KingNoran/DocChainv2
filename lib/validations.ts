import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const studentSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50).optional(),
    lastName: z.string().min(1).max(50),
    course: z.enum(["BSIT", "BSCS", "BSCRIM", "BSHM", "BSP", "BSED_M", "BSED_E", "BSBM_MM"]),
    phone: z.string().regex(/^(09\d{9}|\+639\d{9})$/, {
    message: "Invalid Filipino phone number",
  }),
    email: z.string().email(),
    password: z.string().min(8),
    nationality: z.string().min(1, "Nationality is required").default("Filipino"),
    birthday: z.date(),
    address: z.string().min(1, "Address is required"),
});

export const registrarStudentSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50).optional(),
    lastName: z.string().min(1).max(50),
    course: z.string().min(4).max(6),
    phone: z.string().regex(/^(09\d{9}|\+639\d{9})$/, {
    message: "Invalid Filipino phone number",
  }),
    email: z.string().email(),
    password: z.string().min(8),
    nationality: z.string().default("Filipino"),
    birthday: z.date(),
    address: z.string().min(1, "Address is required"),
});

export const TORFormsSchema = z.object({
  studentUUID: z.string().uuid({ message: "Invalid UUID format" }),
});

export const registrarSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50).optional(),
    lastName: z.string().min(1).max(50),
    phone: z.string().regex(/^(09\d{9}|\+639\d{9})$/, {
    message: "Invalid Filipino phone number",
  }),
    email: z.string().email(),
    password: z.string().min(8),
    nationality: z.string().default("Filipino"),
    birthday: z.date(),
    address: z.string().min(1, "Address is required"),
});

export const adminSchema = z.object({
    firstName: z.string().min(1).max(50),
    middleName: z.string().max(50).optional(),
    lastName: z.string().min(1).max(50),
    phone: z.string().regex(/^(09\d{9}|\+639\d{9})$/, {
    message: "Invalid Filipino phone number",
  }),
    email: z.string().email(),
    password: z.string().min(8),
    nationality: z.string().default("Filipino"),
    birthday: z.date(),
    address: z.string().min(1, "Address is required"),
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

export const transcriptFormSchema = z.object({
  student: z.object({
    name: z.string(),
    nationality: z.string().optional(),
    birthdate: z.string(),
    graduation: z.string(),
    degree: z.string(),
    major: z.string().optional(),
    highSchool: z.string().optional(),
    address: z.string().optional(),
    entrance: z.string(),
  }),
  grades: z.array(
    z.object({
      gradeKey: z.string(),
      syTaken: z.string().optional(),
      instructor: z.string().optional(),
      finalRating: z.string().optional(),
    })
  ),
});
export type TranscriptFormValues = z.infer<typeof transcriptFormSchema>;