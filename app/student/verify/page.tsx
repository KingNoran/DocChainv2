"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import config from "@/lib/config";
import { Button } from "@/components/ui/button";
import { useRef } from "react";


export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const sentRef = useRef(false);

  useEffect(() => {
    const sendVerification = async () => {
      if (!email || !name) {
        toast.error("Missing email or name");
        setLoading(false);
        return;
      }
      if (sentRef.current) return; 
      sentRef.current = true;
      const apiUrl = process.env.NODE_ENV === "production"
      ? config.env.prodApiEndpoint
      : config.env.apiEndpoint;

      try {
        // Call backend to generate verification link
        const res = await fetch(`${apiUrl}/api/email/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (!data.verificationLink) throw new Error("No link returned");

        // Send email via EmailJS (client-side)
        try {
          await emailjs.send(
            config.env.emailjs.serviceId,
            config.env.emailjs.verifyTemplateId,
            {
              name: name,                        // matches {{name}}
              email: email,                      // matches {{email}}
              verification_link: data.verificationLink, // matches {{verification_link}}
            },
            config.env.emailjs.publicKey
          );
          toast.success("Verification email sent!");
        } catch (err: any) {
          console.error("EmailJS error:", err);
          
          // EmailJS sometimes throws an object without message
          const message = err?.text || err?.message || JSON.stringify(err);
          toast.error(`Failed to send verification email: ${message}`);
        }


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

  const backToPage = () => {
    router.push("/student/my-profile");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Button onClick={backToPage}>Go back</Button>
      {loading ? (
        <h2>Sending verification email...</h2>
      ) : (
        <h2>Check your inbox for the verification link!</h2>
      )}
    </div>
  );
}
