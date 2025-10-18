"use client";

import React, { useEffect, useState } from 'react';
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
import { Student } from '@/app/student/types';
import { adminSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { createAdmin } from '@/lib/admin/actions/admin';
import { toast } from 'sonner';
import { useAdminForms } from '../contexts/AdminFormContext';
import NationalitySelect from '@/components/NationalitiesSelect';
import AddressSelect from '@/components/AddressSelect';

interface Props extends Partial<Student>{
  type?: 'create' | 'update';
}

const AdminForms = ({

}: Props) => {
  const router = useRouter();
  const { formData, setFormData } = useAdminForms();
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

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

      router.push(`/admin`)
    } else {
      toast.error(result.error, {
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
    useEffect(() => {
      const mergedAddress = `${city}${city && province ? ", " : ""}${province}`;
      setFormData({ address: mergedAddress });
      adminForms.setValue("address" , mergedAddress);
    }, [city, province]);
    useEffect(() => {
    if (formData.address) {
      const [savedCity, savedProvince] = formData.address.split(",").map(s => s.trim());
      setCity(savedCity || "");
      setProvince(savedProvince || "");
    }
    }, [formData.address]);


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
            <FormField 
                            control={adminForms.control}
                            name="nationality"
                            render={({ field }) => (
                              <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                  Nationality
                                </FormLabel>
                                <FormControl>
                                  <NationalitySelect
                                    value={field.value}
                                    onChange={(val) => {
                                      field.onChange(val);
                                      setFormData({ nationality: val });
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                            <FormField
                                          control={adminForms.control}
                                          name="birthday"
                                          render={({ field }) => (
                                            <FormItem className="flex flex-col gap-1">
                                              <FormLabel>
                                                Birthday <span className="text-red-500">*</span>
                                              </FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="date"
                                                  value={
                                                    field.value instanceof Date 
                                                      ? field.value.toISOString().split("T")[0] 
                                                      : field.value // if string, use as-is or fallback to ""
                                                  }
                                                  onChange={(e) => {
                                                    const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                                                    field.onChange(dateValue);
                                                    setFormData({ birthday: dateValue });
                                                  }}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                            <FormField
                                          control={adminForms.control}
                                          name={"address"}
                                          render={({ field }) => (
                                            <FormItem className="flex flex-col gap-1 w-full">
                                              <FormLabel className="text-base font-normal text-dark-500">
                                                Address
                                              </FormLabel>
                                              <AddressSelect
                                                onChange={(fullAddress: string) => {
                                                  field.onChange(fullAddress);
                                                  setFormData({ address: fullAddress });
                                                }}
                                                defaultValue={field.value}
                                              />
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />   
            <Button type="submit" className="bg-primary-admin text-white">
              Add Admin
            </Button>
        </form>
      </Form>
      
  )
}

export default AdminForms
