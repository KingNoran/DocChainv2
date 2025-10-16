"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";





export default function VerifiedPage() {

    const router = useRouter()
    const backToPage = ()=>{
    router.push("/student/my-profile")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-3">
        ✅ Email Verified Successfully!
      </h1>
      <Button onClick={backToPage}>Got it</Button>
    </div>
  );
}
