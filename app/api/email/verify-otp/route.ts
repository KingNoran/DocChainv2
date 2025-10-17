import redis from "@/database/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const key = `otp:${normalizedEmail}`;
    const storedOtp = await redis.get<string>(key);

    if (!storedOtp) {
      return NextResponse.json({ error: "No OTP generated" }, { status: 400 });
    }

    if (String(storedOtp).trim() !== String(otp).trim()) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await redis.del(key);

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
