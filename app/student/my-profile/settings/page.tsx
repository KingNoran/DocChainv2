"use client";

import { useProfile } from '@/components/ProfileWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import config from '@/lib/config';
import React, { useState } from 'react';
import { toast } from 'sonner';
import emailjs from "@emailjs/browser";

const Page = () => {
  const profile = useProfile();
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const name = `${profile.firstName} ${profile.middleName} ${profile.lastName}`

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

      <div>
        <Card className="px-4">Current password: {"**********"}</Card>
        <Button variant={"default"}>Change Password</Button>
      </div>
    </div>
  );
};

export default Page;
