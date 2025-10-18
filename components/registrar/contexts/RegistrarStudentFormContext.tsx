"use client";

import { CourseCode } from "@/components/admin/contexts/StudentFormContext";
import { createFormContext } from "@/components/FormContext";

type RegistrarStudentContext = {
    firstName: string;
    middleName: string;
    lastName: string;
    course: CourseCode;
    phone: string;
    email: string;
    nationality: string;
    birthday: Date;
    address: string;
    highschool: string;
    major: string;
    
}

export const { Provider: RegistrarStudentFormProvider, useForm: useRegistrarStudentForms } =
  createFormContext<RegistrarStudentContext>("RegistrarStudentForms", {
    firstName: "",
    middleName: "",
    lastName: "",
    course: "BSCS",
    phone: "",
    email: "",
    nationality: "",
    birthday: new Date,
    address: "",
    highschool: "",
    major: ""
  });
