// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: "ADMIN" | "REGISTRAR" | "STUDENT";
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: "ADMIN" | "REGISTRAR" | "STUDENT";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    role?: "ADMIN" | "REGISTRAR" | "STUDENT";
    iat?: number;
    exp?: number;
  }
}
