"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Invalid or missing token");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/email/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) {
          router.push("/student/verified");
        } else {
          toast.error(data.error || "Verification failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error during verification");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {loading ? <h2>Verifying email...</h2> : <h2>Redirecting...</h2>}
      <Button onClick={() => router.push("/student/my-profile")}>Go to profile</Button>
    </div>
  );
}
