"use client";

import { createFormContext } from "../../FormContext";

export type CourseCode =
  | "BSIT"
  | "BSCS"
  | "BSCRIM"
  | "BSHM"
  | "BSP"
  | "BSED_M"
  | "BSED_E"
  | "BSBM_MM";


export type StudentContext = {
  firstName: string;
  middleName: string;
  lastName: string;
  course: CourseCode;
  phone: string;
  email: string;
  password: string;
  nationality: string;
  birthday?: Date;
  address: string;
};

export const { Provider: StudentFormProvider, useForm: useStudentForms } =
  createFormContext<StudentContext>("StudentForms", {
    firstName: "",
    middleName: "",
    lastName: "",
    course: "BSIT",
    phone: "",
    email: "",
    password: "",
    nationality: "",
    birthday: new Date(),
    address: ""
  });
