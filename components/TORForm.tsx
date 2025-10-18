"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { TORFormsSchema } from "@/lib/validations";

type TORFormValues = z.infer<typeof TORFormsSchema>;

interface TORFormProps {
  onSubmit: (data: TORFormValues) => Promise<{ success: boolean; error?: string } | {success: boolean, error?: undefined} | undefined>;
}

const TORForm = ({ onSubmit }: TORFormProps) => {
  const [show, setShow] = useState(false);
  const form = useForm<TORFormValues>({
    resolver: zodResolver(TORFormsSchema),
    defaultValues: { studentUUID: "" },
  });

  const handleSubmit = async (values: TORFormValues) => {
    const result = await onSubmit(values);
    const date = new Date().toUTCString();
    if (result!.success) {
      toast.success("TOR Verified Successfully!", {
        description: `Date: ${date}`,
      });
    } else {
      toast.error("Invalid TOR", {
        description: `Error: ${result!.error ?? "Verification failed"}\n${date}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="studentUUID"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs sm:text-sm font-normal leading-tight">
                StudentUUID
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="tor-hash"
                    type={show ? "text" : "password"}
                    placeholder="Enter your UUID..."
                    className="bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-lg h-10 sm:h-12 pr-10"
                    autoComplete="off"
                    {...field}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-emerald-300 focus:outline-none"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide TOR hash" : "Show TOR hash"}
                  >
                    {show ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <path
                          stroke="#34D399"
                          strokeWidth="1.5"
                          d="M2.5 10S5.5 5 10 5s7.5 5 7.5 5-3 5-7.5 5S2.5 10 2.5 10Z"
                        />
                        <circle cx="10" cy="10" r="2.5" stroke="#34D399" strokeWidth="1.5" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <path
                          stroke="#34D399"
                          strokeWidth="1.5"
                          d="M2.5 10S5.5 5 10 5s7.5 5 7.5 5-3 5-7.5 5S2.5 10 2.5 10Z"
                        />
                        <circle cx="10" cy="10" r="2.5" stroke="#34D399" strokeWidth="1.5" />
                        <path stroke="#34D399" strokeWidth="1.5" d="M4 16l12-12" />
                      </svg>
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-4 h-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="2" fill="none" />
              <rect x="11" y="10" width="2" height="6" rx="1" fill="#34D399" />
              <rect x="11" y="7" width="2" height="2" rx="1" fill="#34D399" />
            </svg>
          </span>
          <span className="text-muted-foreground text-xs sm:text-sm font-normal leading-tight">
            Security Information
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground font-medium text-base rounded-lg h-10 sm:h-12 w-full sm:w-72 hover:bg-emerald-300 transition-colors"
          >
            View TOR
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TORForm;
