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
import { courses } from '@/components/CourseSelect';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CourseCode } from '@/components/admin/contexts/StudentFormContext';

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
    const result = await sendRequest(values, session, type!);
    const date = new Date().toUTCString();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    if(result.success){
      toast.success("Request Sent!", {
        description: `Date: ${date}`,
        action: {
          label: "Got it",
          onClick: () => console.log("Success"),
        },
      })

      router.push(`/registrar`);

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
                  name={"course"}
                  render={({field})=>(
                      <FormItem className='flex flex-col gap-1'>
                          <FormLabel className="text-base font-normal text-dark-500">
                              Course <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                              <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setFormData({ ...formData, course: value as CourseCode }); // ✅ keep your formData in sync
                              }}
                              value={field.value || formData.course || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                              <SelectContent>
                                {courses.map((course) => (
                                  <SelectItem key={course.code} value={course.code}>
                                    {course.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
              Highschool <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
              <Input
                  required
                  placeholder="Highschool"
                  {...field}
                  value={formData.highschool}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    setFormData({ highschool: e.target.value }); // ✅ fixed
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
              Major <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
              <Input
                  required
                  placeholder="Major"
                  {...field}
                  value={formData.major}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    setFormData({ major: e.target.value }); // ✅ fixed
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
                                    Nationality <span className="text-red-500">*</span>
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
                  name={"address"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 w-full">
                      <FormLabel className="text-base font-normal text-dark-500">
                        Address <span className="text-red-500">*</span>
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