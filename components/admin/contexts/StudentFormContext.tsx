"use client";

import { createFormContext } from "../../FormContext";

type StudentContext = {
    firstName: string;
    middleName: string;
    lastName: string;
    course: string;
    phone: string;
    email: string;
    password: string;
}

export const { Provider: StudentFormProvider, useForm: useStudentForms } =
  createFormContext<StudentContext>("StudentForms", {
    firstName: "",
    middleName: "",
    lastName: "",
    course: "",
    phone: "",
    email: "",
    password: "",
  });
