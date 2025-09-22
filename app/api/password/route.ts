import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const length = parseInt(req.nextUrl.searchParams.get("length") || "12", 10);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return NextResponse.json({ password });
}
