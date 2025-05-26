"use client";

import React, { ReactNode } from 'react';
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
import { course, Student, TOR } from '@/app/(root)/types';
import { registrarStep1Schema, TOR_sem, TOR_subject, TORSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { db } from '@/database/drizzle';
import { students } from '@/database/schema';
import { eq } from "drizzle-orm";
import { subjectChecklists } from '@/app/constants/checklists';
interface Props extends Partial<Student>{
  type?: 'create' | 'update';
}


const courses = 
    [
      "BSIT",
      "BSCS",
      "BSCRIM",
      "BSHM",
      "BSP",
      "BSED_M",
      "BSED_E",
      "BSBM_MM",
      "BSBM_HR",
      null
    ];

const CreateTor = ({
  type
}: Props) => {

  const onSubmit1 = async(values: z.infer<typeof registrarStep1Schema>)=>{
    try{
      const input = registrarStep1Schema.parse(values);
      console.log(input);
      /* router.push("/registrar/tor/fill") */
    } catch(err){
      console.log(err)
    }
  }

  const onSubmit2 = async(values : z.infer<typeof TOR_subject>)=>{

  }

  const step1 = useForm<z.infer<typeof registrarStep1Schema>>({
    resolver: zodResolver(registrarStep1Schema),
    defaultValues: {
        name: "",
        course: "",
        studentId: 0,
    }
  });

  const step2 = useForm<z.infer<typeof TOR_subject>>({
    resolver: zodResolver(TOR_subject),
    defaultValues: {
      courseTitle: "",
      finalGrade: 0,
      creditUnit: {lecture: 0, laboratory: 0},
      instructor: "",
    },
  });

  const step3 = useForm<z.infer<typeof TOR_sem>>({
    resolver: zodResolver(TOR_sem),
    defaultValues: [],
  });



  return (
      <Form {...step1}>
        <form 
        onSubmit={step1.handleSubmit(onSubmit1)} 
        className="space-y-8 flex flex-col items-start">
          <FormField 
            control={step1.control}
            name={"name"}
            render={({field})=>(
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className="text-base font-normal text-dark-500">
                  Name
                </FormLabel>
                <FormControl>
                    <Input
                        required
                        placeholder="Name"
                        {...field}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={step1.control}
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
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={step1.control}
            name={"studentId"}
            render={({field})=>(
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className="text-base font-normal text-dark-500">
                  Student ID
                </FormLabel>
                <FormControl>
                    <Input
                        type="number"
                        min={0}
                        required
                        placeholder="Student ID"
                        {...field}
                        onChange={(Event)=>{field.onChange(Number(Event.target.value))}}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-admin text-white">
            Find User
          </Button>
        </form>
      </Form>
      
  )
}

export default CreateTor;
