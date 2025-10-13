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
import { registrarStudentSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRegistrarStudentForms } from '../contexts/RegistrarStudentFormContext';
import { Session } from "next-auth";
import { sendRequest } from '@/lib/registrar/actions/sendRequest';
import AddressSelect from '@/components/AddressSelect';
import NationalitySelect from '@/components/NationalitiesSelect';

interface Props extends Partial<Student>{
  type: 'create' | 'update';
  session: Session;
}



const RegistrarStudentForms = (
  {type, session} : Props
) => {
  const router = useRouter();
  const { formData, setFormData } = useRegistrarStudentForms();
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

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
      toast.error(result.error, {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log(`${result.error}`),
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
              Submit
            </Button>
        </form> 
      </Form>
      
  )
}

export default RegistrarStudentForms;