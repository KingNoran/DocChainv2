"use client";

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from "react-hook-form";
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';
import { roles, Student } from '@/app/(root)/types';
import { studentSchema, userSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { createUser } from '@/lib/admin/actions/user';
import { toast } from 'sonner';


interface Props extends Partial<Student>{
  type?: 'create' | 'update';
}

const UserForms = ({
  type, 
  ...user
}: Props) => {
  const router = useRouter();

  const onSubmit = async(values: z.infer<typeof userSchema>,)=>{
    const result = await createUser(values);
    const date = new Date().toUTCString();

    if(result.success){
      toast.success("User Inserted!", {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Success"),
        },
      })

      router.push(`/admin/create/${result.data.id}`)
    } else {
      toast.error("Error Occured.", {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Unsuccessful"),
        },
      })
    }
  }

  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
        role: "",
        password: "", 
        firstName: "", 
        middleName: "", 
        lastName: "", 
        email: "", 
        phone: "",
    }
  });

  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      year: 1,
      semester: 1,
      course: "",
      finalGrade: 0,
      torReady: false,
    }
  });

  

  return (
      <Form {...userForm}>
        <form 
        onSubmit={userForm.handleSubmit(onSubmit)} 
        className="space-y-8 flex flex-col items-start">
            <FormField 
            control={userForm.control}
            name={"lastName"}
            render={({field})=>(
                <FormItem className='flex flex-col gap-1'>
                    <FormLabel className="text-base font-normal text-dark-500">
                        Last Name
                    </FormLabel>
                    <FormControl>
                        <Input
                            required
                            placeholder="Last Name"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={userForm.control}
            name={"firstName"}
            render={({field})=>(
                <FormItem className='flex flex-col gap-1'>
                    <FormLabel className="text-base font-normal text-dark-500">
                        First Name
                    </FormLabel>
                    <FormControl>
                        <Input
                            required
                            placeholder="First Name"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={userForm.control}
            name={"middleName"}
            render={({field})=>(
                <FormItem className='flex flex-col gap-1'>
                    <FormLabel className="text-base font-normal text-dark-500">
                        Middle Name
                    </FormLabel>
                    <FormControl>
                        <Input
                            required
                            placeholder="Middle Name"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={userForm.control}
            name={"email"}
            render={({field})=>(
                <FormItem className='flex flex-col gap-1'>
                    <FormLabel className="text-base font-normal text-dark-500">
                        Email
                    </FormLabel>
                    <FormControl>
                        <Input
                            required
                            placeholder="Email"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={userForm.control}
            name={"password"}
            render={({field})=>(
                <FormItem className='flex flex-col gap-1'>
                    <FormLabel className="text-base font-normal text-dark-500">
                        Password
                    </FormLabel>
                    <FormControl>
                        <Input
                            required
                            placeholder="Password"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={userForm.control}
            name={"role"}
            render={({field})=>(
                <FormItem className='flex flex-col gap-1'>
                    <FormLabel className="text-base font-normal text-dark-500">
                        Role
                    </FormLabel>
                    <FormControl>
                        <Input
                            required
                            placeholder="Role"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={userForm.control}
            name={"phone"}
            render={({field})=>(
                <FormItem className='flex flex-col gap-1'>
                    <FormLabel className="text-base font-normal text-dark-500">
                        Phone Number
                    </FormLabel>
                    <FormControl>
                        <Input
                            required
                            placeholder="Phone Number"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <Button type="submit" className="bg-primary-admin text-white">
              Add User
            </Button>
        </form>
      </Form>
      
  )
}

export default UserForms
