"use client";

import { useProfile } from '@/components/ProfileWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import config from '@/lib/config';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import emailjs from "@emailjs/browser";
import { signOut } from "next-auth/react";

const Page = () => {
  const profile = useProfile();
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const name = `${profile.firstName} ${profile.middleName} ${profile.lastName}`

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCooldown > 0) {
      timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  const sendOtp = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password first");
      return;
    }
    if (otpCooldown > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
        setOtpCooldown(60); // 60s cooldown before next OTP
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndChangePassword = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Verify OTP
      const otpRes = await fetch("/api/password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, otp }),
      });
      const otpData = await otpRes.json();

      if (!otpData.valid) {
        toast.error(otpData.error || "Invalid OTP");
        return;
      }

      // 2️⃣ Update password
      const updateRes = await fetch("/api/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.userId, newPassword }),
      });
      const updateData = await updateRes.json();

      if (updateData.success) {
        toast.success("Password changed successfully! Logging out...");
        // Clear input fields
        setNewPassword("");
        setOtp("");
        setOtpSent(false);
        setOtpCooldown(0);

        // Force logout after a short delay
        setTimeout(() => {
          signOut({ callbackUrl: "/login"}); // this will handle session removal / redirect
        }, 1500);
      } else {
        toast.error(updateData.error || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailChangeVerification = async () => {
  if (!newEmail) {
    toast.error("Please enter a new email");
    return;
  }
  setLoading(true);

  try {
    const res = await fetch("/api/email/change", { // new endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        newEmail, 
        userId: profile.userId, 
        name: name 
      }),
    });

    const data = await res.json();

    if (!data.verificationLink) throw new Error("No link returned");


      try{
        await emailjs.send(
      config.env.emailjs.serviceId,
      config.env.emailjs.verifyTemplateId,
      {
        name,
        email: newEmail,
        verification_link: data.verificationLink,
      },
      config.env.emailjs.publicKey
    );
      toast.success("Email sent!");
      } catch(error){
        toast.error("Email not sent.", {
          description: (error as Error).message
        });
      }


  } catch (err: any) {
    console.error(err);
    toast.error("Failed to send verification email.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex gap-5">
      <div>
        <Card className="px-4 mb-2">Current email: {profile.email}</Card>
        <input
          type="email"
          placeholder="New email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <Button variant={"default"} onClick={handleSendEmailChangeVerification} disabled={loading}>
          {loading ? "Sending..." : "Change Email"}
        </Button>
      </div>

      <div className="flex flex-col gap-3 max-w-md mx-auto mt-5">
      <Card>Current password: {"**********"}</Card>

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border p-2 rounded"
      />

      {!otpSent ? (
        <Button onClick={sendOtp} disabled={loading || otpCooldown > 0}>
          {loading ? "Sending OTP..." : otpCooldown > 0 ? `Resend OTP (${otpCooldown}s)` : "Send OTP"}
        </Button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded"
          />
          <Button onClick={verifyOtpAndChangePassword} disabled={loading}>
            {loading ? "Verifying..." : "Confirm & Change Password"}
          </Button>
        </>
      )}
    </div>
    </div>
  );
};

export default Page;
