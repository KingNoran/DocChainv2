"use client"

import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark";
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "student-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(defaultTheme);

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setTheme(stored as "light" | "dark");
  }, [storageKey]);

  return <div className={theme}>{children}</div>;
}
