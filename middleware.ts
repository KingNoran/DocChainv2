import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // your NextAuth instance

export async function middleware(req: NextRequest) {
  const session = await auth();

  const { pathname } = req.nextUrl;

  // 1. Public routes
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. Redirect guests trying to access protected routes
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3. Role-based access rules
  const role = session.user?.role;

  // Student-only
  if (pathname.startsWith("/my-profile") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Registrar-only
  if (pathname.startsWith("/registrar") && role !== "REGISTRAR") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Admin-only
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Default allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // run middleware on all routes except assets
};
