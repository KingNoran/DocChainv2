import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // your NextAuth instance
import { eq } from "drizzle-orm";
import { db } from "./database/drizzle";
import { users } from "./database/schema";

export const publicRoutes = ["/", "/login", "/transaction"];
export const authRoutes: {path: string; roles?: string[]}[] = [
  { path: "/student", roles: ["STUDENT"] },
  { path: "/registrar", roles: ["REGISTRAR"] },
  { path: "/admin", roles: ["ADMIN"] },
  { path: "/" },
];

export const protectedApiPrefix = "/api";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  // 1. Public routes
  if (publicRoutes.some((route) => pathname.startsWith(route)) || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. Protected routes
  const matchedRoute = authRoutes.find((route) => pathname.startsWith(route.path));

  if (matchedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (session.user?.id) {
      await db
        .update(users)
        .set({ lastActivityDate: new Date() })
        .where(eq(users.userId, session.user.id))
    }

    const role = session.user?.role;
    if (matchedRoute.roles && !matchedRoute.roles.includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // run middleware on all routes except assets
};
