"use client";

import React, { useState } from 'react';
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
import { course, Student, StudentParams } from '@/app/(root)/types';
import { registrarStep1Schema, TOR_midYear, TOR_sem, TOR_subject, TOR_year, TORSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { checkStudent } from '@/lib/admin/actions/user';
import { redirect } from 'next/navigation';
import { subjectChecklists } from '@/app/constants/checklists';
import { students } from '@/database/schema/students';
interface Props extends Partial<Student>{
  type?: 'create' | 'update';
}

const CreateTor = () => {

  const [showFirstContent, setFirstShowContent] = useState(false);
  const [showSecondContent, setSecondShowContent] = useState(false);
  const [showThirdContent, setThirdShowContent] = useState(false);
  const [showFourthContent, setFourthShowContent] = useState(false);
  const [showMidContent, setMidShowContent] = useState(false);
  const [showMid1Content, setMid1ShowContent] = useState(false);
  const [showMid2Content, setMid2ShowContent] = useState(false);
  const [getCourse, setCourse] = useState({});
  const [getFirstYearSubjects, setFirstYearSubjects] = useState({});
  const [getSecondYearSubjects, setSecondYearSubjects] = useState({});
  const [getThirdYearSubjects, setThirdYearSubjects] = useState({});
  const [getFourthYearSubjects, setFourthYearSubjects] = useState({});
  const [getMidYearSubjects, setMidYearSubjects] = useState({});
  const [getMidYear1YearSubjects, setMidYear1Subjects] = useState({});
  const [getMidYear2Subjects, setMidYear2Subjects] = useState({});


  const onSubmit2 = () => {
    setFirstShowContent(true);
  }

  const onSubmit1 = async(values: z.infer<typeof registrarStep1Schema>)=>{
    try{
      registrarStep1Schema.parse(values);
    } catch(err){
      console.log(err)
    }
    const studentCheck = await checkStudent(values);
    const student : students = JSON.parse(studentCheck!);
    console.log(student)
    setCourse(student.course)
  }

  const step1 = useForm<z.infer<typeof registrarStep1Schema>>({
    resolver: zodResolver(registrarStep1Schema),
    defaultValues: {
        name: "",
        course: "",
        studentId: 0,
    }
  });

  const getSubjects = ()=>{
    return [{}]
  }

  const getFirstSemSubjects = useForm<z.infer<typeof TOR_sem>>({
    resolver: zodResolver(TOR_sem),
    defaultValues: getSubjects()
  })

  



  const getTORfirstYear = useForm<z.infer<typeof TOR_year>>({
    resolver: zodResolver(TOR_year),
    defaultValues:{
      firstSem: [],
      secondSem: []
    }
  })
  const getTORsecondYear = useForm<z.infer<typeof TOR_year>>({
    resolver: zodResolver(TOR_year),
    defaultValues:{
      firstSem: [],
      secondSem: []
    }
  })
  const getTORthirdYear = useForm<z.infer<typeof TOR_year>>({
    resolver: zodResolver(TOR_year),
    defaultValues:{
      firstSem: [],
      secondSem: []
    }
  })
  const getTORfourthYear = useForm<z.infer<typeof TOR_year>>({
    resolver: zodResolver(TOR_year),
    defaultValues:{
      firstSem: [],
      secondSem: []
    }
  })

  const getTORmidYear = useForm<z.infer<typeof TOR_midYear>>({
    resolver: zodResolver(TOR_midYear),
    defaultValues:{
      midSem: []
    }
  })
  const getTORmidYear1 = useForm<z.infer<typeof TOR_midYear>>({
    resolver: zodResolver(TOR_midYear),
    defaultValues:{
      midSem: []
    }
  })
  const getTORmidYear2 = useForm<z.infer<typeof TOR_midYear>>({
    resolver: zodResolver(TOR_midYear),
    defaultValues:{
      midSem: []
    }
  })

  const getTOR = useForm<z.infer<typeof TORSchema>>({
    resolver: zodResolver(TORSchema),
    defaultValues: {
      firstYear: getTORfirstYear.getValues(),
      secondYear: getTORsecondYear.getValues(),
      midYear: getTORmidYear.getValues(),
      midYear1: getTORmidYear1.getValues(),
      midYear2: getTORmidYear2.getValues(),
      thirdYear: getTORthirdYear.getValues(),
      fourthYear: getTORfourthYear.getValues(),
    }
  })

  
  const forms = {...step1, ...getTORfirstYear}


  return (
      <Form {...forms}>
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
          <Button type="submit" onClick={onSubmit2} className="bg-primary-admin text-white">
            Find User
          </Button>
        </form>
        {
          showFirstContent && (
            <>
              <p>{`${getCourse}`}</p>
            </>
          )
        }
      </Form>
      
  )
}

export default CreateTor;
