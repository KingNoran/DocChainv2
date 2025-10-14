"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import config from "@/lib/config";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sendVerification = async () => {
      if (!email || !name) {
        toast.error("Missing email or name");
        return;
      }

      try {
        const res = await fetch("/api/email/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (!data.verificationLink) throw new Error("No link returned");

        await emailjs.send(
          config.env.emailjs.serviceId,
          config.env.emailjs.verifyTemplateId,
          {
            to_name: name,
            to_email: email,
            verification_link: data.verificationLink,
          },
          config.env.emailjs.publicKey
        );

        toast.success("Verification email sent!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to send verification email.");
      } finally {
        setLoading(false);
      }
    };

    sendVerification();
  }, [email, name]);

  const backToPage = ()=>{
    router.push("/student/my-profile")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <Button onClick={backToPage}>
            Go back
        </Button>
      {loading ? (
        <h2>Sending verification email...</h2>
      ) : (
        <h2>Check your inbox for the verification link!</h2>
      )}
    </div>
  );
}
