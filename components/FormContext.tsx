// context/createFormContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export function createFormContext<T>(storageKey: string, defaultValues: T) {
  type ContextType = {
    formData: T;
    setFormData: (data: Partial<T>) => void;
    resetForm: () => void;
  };

  const FormContext = createContext<ContextType | null>(null);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormDataState] = useState<T>(() => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored) return JSON.parse(stored);
        } catch (err) {
          console.warn("Failed to load localStorage", err);
        }
      }
      return defaultValues;
    });

    useEffect(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(formData));
      } catch (err) {
        console.warn("Failed to save to localStorage", err);
      }
    }, [formData]);

    const setFormData = (data: Partial<T>) => {
      setFormDataState((prev) => ({ ...prev, ...data }));
    };

    const resetForm = () => {
      setFormDataState(defaultValues);
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    };

    return (
      <FormContext.Provider value={{ formData, setFormData, resetForm }}>
        {children}
      </FormContext.Provider>
    );
  };

  const useForm = () => {
    const ctx = useContext(FormContext);
    if (!ctx) throw new Error("useForm must be used inside its Provider");
    return ctx;
  };

  return { Provider, useForm };
}
