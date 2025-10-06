"use client";

import { createFormContext } from "../../FormContext";

type AdminFormContext = {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    nationality: string,
    birthday: Date,
    address: string,
}

export const { Provider: AdminFormProvider, useForm: useAdminForms } =
  createFormContext<AdminFormContext>("AdminForms", {
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    nationality: "",
    birthday: new Date,
    address: "",
  });