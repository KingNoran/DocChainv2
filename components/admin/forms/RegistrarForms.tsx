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
import { registrarSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { createRegistrar } from '@/lib/admin/actions/registrar';
import { toast } from 'sonner';
import { useRegistrarForms } from '../contexts/RegistrarFormContext';

interface Props extends Partial<Student>{
  type?: 'create' | 'update';
}

const RegistrarForms = ({
  type, 
  ...user
}: Props) => {
  const router = useRouter();
  const { formData, setFormData } = useRegistrarForms();

  const onSubmit = async(values: z.infer<typeof registrarSchema>,)=>{
    const result = await createRegistrar(values);
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

  const registrarForms = useForm<z.infer<typeof registrarSchema>>({
    resolver: zodResolver(registrarSchema),
    defaultValues: formData
  });

  useEffect(()=>{
      registrarForms.reset(formData);
    }, [formData, registrarForms]);

  

  return (
      <Form {...registrarForms}>
        <form 
        onSubmit={registrarForms.handleSubmit(onSubmit)} 
        className="space-y-8 flex flex-col items-start">
            <FormField 
            control={registrarForms.control}
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
            control={registrarForms.control}
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
            control={registrarForms.control}
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
            control={registrarForms.control}
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
            control={registrarForms.control}
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
            control={registrarForms.control}
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

export default RegistrarForms
