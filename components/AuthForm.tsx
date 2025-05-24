"use client";

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { ZodType } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FIELD_NAMES, FIELD_TYPES } from '@/app/constants';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "LOG_IN" | "REGISTER";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit
}: Props<T>) => {
  const router = useRouter();
  const isLogIn = type === "LOG_IN";
  const [showPassword, setShowPassword] = useState(false);

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    const date = new Date().toUTCString();

    if (result.success) {
      toast.success(isLogIn ? "Logged In Successfully!" : "User Registered Successfully!", {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Success"),
        },
      });
      router.push("/my-profile");
    } else {
      toast.error(`Error ${isLogIn ? "Logging In" : "Registering"}`, {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Error"),
        }
      })
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-3xl font-bold text-center mt-8 mb-2">Welcome Back</h1>
      <p className="text-base text-neutral-400 text-center mb-4">Enter your credentials to access your account</p>
      <div className="w-full max-w-md bg-background text-foreground rounded-2xl p-8 flex flex-col gap-6 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
            {/* Email Field */}
            <FormField
              control={form.control}
              name={"email" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-normal">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Enter email"
                      type="email"
                      className="bg-card border border-border rounded-lg h-12 text-foreground placeholder:text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name={"password" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-normal">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        required
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        className="bg-card border border-border rounded-lg h-12 text-foreground placeholder:text-muted-foreground pr-16"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-normal focus:outline-none"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="w-4 h-4 rounded-sm border border-border bg-background" />
                Remember me
              </label>
              <button type="button" className="text-primary text-sm font-normal hover:underline">Forgot password?</button>
            </div>
            {/* Submit Button */}
            <Button type="submit" className="w-full h-9 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-emerald-500 transition-colors">Enter</Button>
          </form>
        </Form>
      </div>
      {/* Terms and Privacy */}
      <div className="flex gap-8 mt-2 text-sm text-neutral-400">
        <button type="button" className="hover:underline">Terms of Service</button>
        <button type="button" className="hover:underline">Privacy Policy</button>
      </div>
      <Footer />
    </div>
  );
};

export default AuthForm;

