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
import { course, Student } from '@/app/(root)/types';
import { registrarStudentSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRegistrarStudentForms } from '../contexts/RegistrarStudentFormContext';
import { Session } from "next-auth";
import { sendRequest } from '@/lib/registrar/actions/sendRequest';

interface Props extends Partial<Student>{
  type: 'create' | 'update';
  session: Session;
}



const RegistrarStudentForms = (
  {type, session} : Props
) => {
  const router = useRouter();
  const { formData, setFormData } = useRegistrarStudentForms();

  const onSubmit = async(values: z.infer<typeof registrarStudentSchema>,)=>{
    const result = await sendRequest(values, values.course as course, session, type!);
    const date = new Date().toUTCString();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    if(result.success){
      toast.success("Request Sent!", {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Success"),
        },
      })

      router.push(`/registrar/create/${result?.data}`);

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

  const studentForms = useForm<z.infer<typeof registrarStudentSchema>>({
    resolver: zodResolver(registrarStudentSchema),
    defaultValues: formData,
    mode: "onChange"
  });

  useEffect(()=>{
    studentForms.reset(formData);
  }, [formData, studentForms]);

  

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

export default RegistrarStudentForms;