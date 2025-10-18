// app/api/password/send-otp/route.ts
import { auth } from "@/auth";
import redis from "@/database/redis";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${session.user.email}`;
    await redis.set(key, otp, { ex: 300 }); // 5 minutes

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"DocChain" <${process.env.SMTP_USER}>`,
      to: session.user.email,
      subject: "Your verification code",
      html: `<p>Your OTP: <b>${otp}</b> (expires in 5 minutes)</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
