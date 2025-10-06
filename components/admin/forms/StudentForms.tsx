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
import { course, Student } from '@/app/(root)/types';
import { studentSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { createStudent } from '@/lib/admin/actions/student';
import { toast } from 'sonner';
import { useStudentForms } from '../contexts/StudentFormContext';

interface Props extends Partial<Student>{
  type?: 'create' | 'update';
}



const StudentForms = ({
  type, 
  ...user
}: Props) => {
  const router = useRouter();
  const { formData, setFormData } = useStudentForms();
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

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

      router.push(`/admin/create/${result?.data}`);

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

  const studentForms = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: formData,
    mode: "onChange"
  });

  useEffect(()=>{
    studentForms.reset(formData);
  }, [formData, studentForms]);
  useEffect(() => {
    const mergedAddress = `${city}${city && province ? ", " : ""}${province}`;
    setFormData({ address: mergedAddress });
    studentForms.setValue("address" , mergedAddress);
  }, [city, province]);
  useEffect(() => {
  if (formData.address) {
    const [savedCity, savedProvince] = formData.address.split(",").map(s => s.trim());
    setCity(savedCity || "");
    setProvince(savedProvince || "");
  }
  }, [formData.address]);
  

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
                  control={studentForms.control}
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
                  control={studentForms.control}
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
                  control={studentForms.control}
                  name={"course"}
                  render={({field})=>(
                      <FormItem className='flex flex-col gap-1'>
                          <FormLabel className="text-base font-normal text-dark-500">
                              Course
                          </FormLabel>
                          <FormControl>
                              <Input
                                  required
                                  placeholder="Course"
                                  {...field}
                                  value={formData.course}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    field.onChange(e);
                                    setFormData({course: e.target.value });
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
                  control={studentForms.control}
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
                  control={studentForms.control}
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
              </div>
              <FormField 
                                control={studentForms.control}
                                name={"nationality"}
                                render={({field})=>(
                                    <FormItem className='flex flex-col gap-1'>
                                        <FormLabel className="text-base font-normal text-dark-500">
                                            Nationality
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                placeholder="Nationality"
                                                {...field}
                                                value={formData.nationality}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                  field.onChange(e);
                                                  setFormData({nationality: e.target.value });
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
                                    <FormLabel className="text-base font-normal text-dark-500">
                                      Birthday
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        required
                                        type="date"
                                        {...field}
                                        value={formData.birthday ? new Date(formData.birthday).toISOString().split("T")[0] : ""}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          const dateValue = e.target.value ? new Date(e.target.value) : new Date();
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
                                name={"address"}
                                render={({ field }) => (
                                  <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="text-base font-normal text-dark-500">
                                      Address
                                    </FormLabel>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                      <Input
                                        required
                                        {...field}
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                      />
                                      <Input
                                        required
                                        {...field}
                                        placeholder="Province"
                                        value={province}
                                        onChange={(e) => setProvince(e.target.value)}
                                      />
                                    </div>
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
              Submit
            </Button>
        </form> 
      </Form>
      
  )
}

export default StudentForms;