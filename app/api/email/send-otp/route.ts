import redis from "@/database/redis";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log("📩 Sending OTP to:", normalizedEmail);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with 5-minute expiry
    await redis.set(`otp:${normalizedEmail}`, otp, { ex: 300 });
    console.log(`✅ Stored OTP for ${normalizedEmail}: ${otp}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DocChain Verification" <${process.env.SMTP_USER}>`,
      to: normalizedEmail,
      subject: "Your DocChain Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Verify Your Email</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 4px; color: #2563eb;">${otp}</h1>
          <p>This code will expire in <b>5 minutes</b>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
