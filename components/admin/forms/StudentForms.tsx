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
import { course, Student } from '@/app/student/types';
import { StudentInputs, studentSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { createStudent } from '@/lib/admin/actions/student';
import { toast } from 'sonner';
import { CourseCode, useStudentForms } from '../contexts/StudentFormContext';
import AddressSelect from "@/components/AddressSelect";
import CourseSelect from '@/components/CourseSelect';
import NationalitySelect from '@/components/NationalitiesSelect';

const StudentForms = () => {
  const router = useRouter();
  const { formData, setFormData } = useStudentForms();

  const onSubmit = async(values: z.infer<typeof studentSchema>,)=>{
    const result = await createStudent(values, values.course as course);
    const date = new Date().toUTCString();

    if(result.success){
      toast.success("User Inserted!", {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Success"),
        },
      })

      router.push(`/admin`);

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

  const studentForms = useForm<StudentInputs>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ...formData,
      birthday: formData.birthday ? new Date(formData.birthday) : undefined,
    },
    mode: "onChange"
  });


  

  return (
      <Form {...studentForms}>
        <form 
        onSubmit={studentForms.handleSubmit(onSubmit)}>
            <div className="space-y-8 flex flex-col items-start">
                <FormField 
                  control={studentForms.control}
                  name={"lastName"}
                  render={({field})=>(
                      <FormItem className='flex flex-col gap-1'>
                          <FormLabel className="text-base font-normal text-dark-500">
                              Last Name <span className="text-red-500">*</span>
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
                  control={studentForms.control}
                  name={"firstName"}
                  render={({field})=>(
                      <FormItem className='flex flex-col gap-1'>
                          <FormLabel className="text-base font-normal text-dark-500">
                              First Name <span className="text-red-500">*</span>
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
                  control={studentForms.control}
                  name={"middleName"}
                  render={({field})=>(
                      <FormItem className='flex flex-col gap-1'>
                          <FormLabel className="text-base font-normal text-dark-500">
                              Middle Name
                          </FormLabel>
                          <FormControl>
                              <Input
                                  placeholder="Middle Name (optional)"
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
                    control={studentForms.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-base font-normal text-dark-500">
                          Course
                        </FormLabel>
                        <FormControl>
                          <CourseSelect
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val);
                              setFormData({ course: val as CourseCode });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField 
                  control={studentForms.control}
                  name={"email"}
                  render={({field})=>(
                      <FormItem className='flex flex-col gap-1'>
                          <FormLabel className="text-base font-normal text-dark-500">
                              Email <span className="text-red-500">*</span>
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
                  control={studentForms.control}
                  name={"password"}
                  render={({field})=>(
                      <FormItem className='flex flex-col gap-1'>
                          <FormLabel className="text-base font-normal text-dark-500">
                              Password <span className="text-red-500">*</span>
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
                  control={studentForms.control}
                  name={"phone"}
                  render={({field})=>(
                      <FormItem className='flex flex-col gap-1'>
                          <FormLabel className="text-base font-normal text-dark-500">
                              Phone Number <span className="text-red-500">*</span>
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
              </div>
              <FormField 
                                control={studentForms.control}
                                name={"highschool"}
                                render={({field})=>(
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel className="text-base font-normal text-dark-500">
                                            Highschool
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                placeholder="Highschool"
                                                {...field}
                                                value={formData.highschool}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                  field.onChange(e);
                                                  setFormData({highschool: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                  )} 
                                />
                                <FormField 
                                control={studentForms.control}
                                name={"major"}
                                render={({field})=>(
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel className="text-base font-normal text-dark-500">
                                            Major
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                placeholder="Major"
                                                {...field}
                                                value={formData.major}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                  field.onChange(e);
                                                  setFormData({major: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                  )} 
                                />
              <FormField 
                control={studentForms.control}
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
              control={studentForms.control}
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
              control={studentForms.control}
              name="dateEntrance"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>
                    Entrance <span className="text-red-500">*</span>
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
                        setFormData({ dateEntrance: dateValue });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={studentForms.control}
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
            { /* Controls */}
            {/* <div className="flex gap-5">
              {step > 1 && (
                <Button 
                  className="bg-primary-admin text-white"
                  onClick={()=>setStep((s)=>s-1)}
                  >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  className="bg-primary-admin text-white"
                  onClick={()=>setStep((s)=>s+1)}
                  >
                  Next
                </Button>
              ) : (
                <Button 
                  className="bg-primary-admin text-white"
                  type="submit"
                  >
                  Submit
                </Button>
              )}
            </div> */}
            <Button 
              className="bg-primary-admin text-white"
              type="submit"
              >
              Add Student
            </Button>
        </form> 
      </Form>
      
  )
}

export default StudentForms;