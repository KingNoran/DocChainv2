"use client";

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { ZodType } from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FIELD_NAMES, FIELD_TYPES } from '@/app/constants';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';


interface Props<T extends FieldValues>{
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{success: boolean; error?: string}>;
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

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    const date = new Date().toUTCString();
    

    if(result.success){
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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        {isLogIn ? "Welcome Back" : ""}
      </h1>
      <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-8 w-full">
          
          {
          Object.keys(defaultValues).map((field)=>(
            <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                <FormControl>
                  <Input required placeholder={"Enter " + field.name} type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          ))
          }

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Button className="text-center text-base font-medium cursor-pointer" variant={"link"} onClick={()=>redirect("/")}>
        {"<-Return"}
      </Button>
      
    </div>
  )
}

export default AuthForm
