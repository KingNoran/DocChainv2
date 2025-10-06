"use client";

import { createFormContext } from "@/components/FormContext";

type RegistrarStudentContext = {
    firstName: string;
    middleName: string;
    lastName: string;
    course: string;
    phone: string;
    email: string;
    password: string;
    nationality: string,
    birthday: Date,
    address: string,
}

export const { Provider: RegistrarStudentFormProvider, useForm: useRegistrarStudentForms } =
  createFormContext<RegistrarStudentContext>("RegistrarStudentForms", {
    firstName: "",
    middleName: "",
    lastName: "",
    course: "",
    phone: "",
    email: "",
    password: "",
    nationality: "",
    birthday: new Date,
    address: "",
  });
