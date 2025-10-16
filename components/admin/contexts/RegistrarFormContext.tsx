"use client";

import { createFormContext } from "../../FormContext";

type RegistrarContext = {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    nationality: string,
    birthday?: Date,
    address: string,
}

export const { Provider: RegistrarFormProvider, useForm: useRegistrarForms } =
  createFormContext<RegistrarContext>("RegistrarForms", {
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    nationality: "",
    birthday: new Date(),
    address: "",
  });
