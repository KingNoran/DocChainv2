"use client";

import AuthForm from '@/components/AuthForm';
import { signInWithCredentials } from '@/lib/actions/auth';
import { loginSchema } from '@/lib/validations';
import React from 'react';
import { ModeToggle } from '@/components/ui/toggle-mode';
import Link from 'next/link';
import Header from '@/components/Header';

const Page = () => {

  return (
    <>
      <Header></Header>
      <AuthForm 
        type="LOG_IN"
        schema={loginSchema}
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={signInWithCredentials}
      />
    </>
  );
}


export default Page;

