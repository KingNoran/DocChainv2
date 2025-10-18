"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function ConfirmEmailChangePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const confirmEmailChange = async () => {
      try {
        const res = await fetch("/api/email/confirm-change", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (data.success) {
          toast.success("Email changed successfully! You will be logged out.");
          
          // Force logout after a short delay to allow the toast to show
          setTimeout(() => {
            signOut({ callbackUrl: "/login" }); // redirect to login page
          }, 1500);

        } else {
          toast.error(data.error || "Failed to confirm email change");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to confirm email change");
      } finally {
        setLoading(false);
      }
    };

    confirmEmailChange();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {loading ? (
        <p>Verifying your email...</p>
      ) : (
        <Button onClick={() => signOut({ callbackUrl: "/login" })}>
          Back to login
        </Button>
      )}
    </div>
  );
}
