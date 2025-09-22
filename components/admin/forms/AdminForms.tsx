"use client";

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
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
import { Student } from '@/app/(root)/types';
import { adminSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { createAdmin } from '@/lib/admin/actions/admin';
import { toast } from 'sonner';
import { useAdminForms } from '../contexts/AdminFormContext';

interface Props extends Partial<Student>{
  type?: 'create' | 'update';
}

const AdminForms = ({

}: Props) => {
  const router = useRouter();
  const { formData, setFormData } = useAdminForms();

  const onSubmit = async(values: z.infer<typeof adminSchema>,)=>{
    const result = await createAdmin(values);
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

  const adminForms = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: formData
  });

  useEffect(()=>{
    adminForms.reset(formData);
  }, [formData, adminForms]);

  return (
      <Form {...adminForms}>
        <form 
        onSubmit={adminForms.handleSubmit(onSubmit)} 
        className="space-y-8 flex flex-col items-start">
            <FormField 
            control={adminForms.control}
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
                            value={formData.lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              field.onChange(e);
                              setFormData({lastName: e.target.value });
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={adminForms.control}
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
                            value={formData.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              field.onChange(e);
                              setFormData({firstName: e.target.value });
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={adminForms.control}
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
                            value={formData.middleName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              field.onChange(e);
                              setFormData({middleName: e.target.value });
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={adminForms.control}
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
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              field.onChange(e);
                              setFormData({email: e.target.value });
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={adminForms.control}
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
                            value={formData.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              field.onChange(e);
                              setFormData({password: e.target.value });
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
            control={adminForms.control}
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
                            value={formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              field.onChange(e);
                              setFormData({phone: e.target.value });
                            }}
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

export default AdminForms
