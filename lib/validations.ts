import { z } from "zod";

//
// ─── LOGIN SCHEMA ──────────────────────────────────────────────────────────────
//
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

//
// ─── HELPERS ──────────────────────────────────────────────────────────────────
//

// Allow only letters, spaces, hyphens, and apostrophes
const nameRegex = /^[A-Za-z\s'-]+$/;

// Check if date makes user at least 18 years old
const isAdult = (date: Date) => {
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();
  return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
};

//
// ─── COMMON FIELD GROUPS ───────────────────────────────────────────────────────
//

const nameFields = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50)
    .regex(nameRegex, { message: "First name must only contain letters, spaces, or hyphens" }),

  middleName: z
    .string()
    .max(50)
    .regex(nameRegex, { message: "Middle name must only contain letters, spaces, or hyphens" })
    .default(""),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50)
    .regex(nameRegex, { message: "Last name must only contain letters, spaces, or hyphens" }),
});

const personalFields = z.object({
  phone: z
    .string()
    .regex(/^(09\d{9}|\+639\d{9})$/, { message: "Invalid Filipino phone number" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z.string().min(8, "Password must be at least 8 characters long"),

  nationality: z.string().min(1, "Nationality is required").default("Filipino"),

  birthday: z
    .date()
    .refine(isAdult, { message: "Must be at least 18 years old" }),

  address: z.string().min(1, "Address is required"),
});

//
// ─── STUDENT SCHEMA ────────────────────────────────────────────────────────────
//

export const studentSchema = nameFields
  .merge(personalFields)
  .extend({
    course: z.enum([
      "BSIT",
      "BSCS",
      "BSCRIM",
      "BSHM",
      "BSP",
      "BSED_M",
      "BSED_E",
      "BSBM_MM",
    ]),
    major: z.string().min(1, "Major is required"),
    highschool: z.string().min(1, "High school is required"),
    dateEntrance: z.date().default(new Date()),
    torHash: z.string().default(""),
  });

export type StudentInputs = z.infer<typeof studentSchema>;

//
// ─── REGISTRAR STUDENT SCHEMA ─────────────────────────────────────────────────
//
export const registrarStudentSchema = nameFields
  .merge(personalFields)
  .extend({
    course: z.enum([
      "BSIT",
      "BSCS",
      "BSCRIM",
      "BSHM",
      "BSP",
      "BSED_M",
      "BSED_E",
      "BSBM_MM",
    ]),
    major: z.string().min(1, "Major is required"),
    highschool: z.string().min(1, "High school is required"),
    dateEntrance: z.date().default(new Date()),
    torHash: z.string().default("")
  });

//
// ─── TOR FORM SCHEMA ──────────────────────────────────────────────────────────
//
export const TORFormsSchema = z.object({
  studentUUID: z.string().uuid({ message: "Invalid UUID format" }),
});

//
// ─── REGISTRAR SCHEMA ─────────────────────────────────────────────────────────
//
export const registrarSchema = nameFields.merge(personalFields);

//
// ─── ADMIN SCHEMA ─────────────────────────────────────────────────────────────
//
export const adminSchema = nameFields.merge(personalFields);

//
// ─── TOR STRUCTURE SCHEMAS ────────────────────────────────────────────────────
//

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
  secondSem: TOR_sem,
});

export const TOR_midYear = z.object({
  midSem: TOR_sem,
});

export const TORSchema = z.object({
  firstYear: TOR_year,
  secondYear: TOR_year,
  midYear: TOR_midYear.optional(),
  midYear1: TOR_midYear.optional(),
  midYear2: TOR_midYear.optional(),
  thirdYear: TOR_year,
  fourthYear: TOR_year,
});

//
// ─── TRANSCRIPT FORM ──────────────────────────────────────────────────────────
//

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
