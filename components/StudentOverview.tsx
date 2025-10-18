"use client";

import { StudentOverviewTemplate } from '@/app/student/types'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { LogOut, Verified, VerifiedIcon } from 'lucide-react'
import { logout } from '@/lib/actions/logout'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CourseCode } from './admin/contexts/StudentFormContext';


const StudentOverview = ({
    studentId,
    userId,
    course,
    torReady,
    role,
    password,
    firstName,
    middleName,
    lastName,
    email,
    phone,
    emailVerified,
    phoneVerified,
    lastActivityDate,
    createdAt,
    nationality,
    address,
    birthday,
    highschool,
    major,
    
}: StudentOverviewTemplate) => {

  const joinedDate = (createdAt : string)=>
    {
      return new Date(createdAt).toUTCString()
    };

  const lastActivity = (lastActivityDate : string)=>{
    return new Date(lastActivityDate).toUTCString()
  }

  const router = useRouter();
  const {data: session} = useSession();
  const lastActDate = `${lastActivityDate.getMonth()}${lastActivityDate.getDay()}${lastActivityDate.getFullYear()}`

  const courses = {
   BSIT: "BS Information Technology" ,
   BSCS: "BS Computer Science" ,
   BSCRIM: "BS Criminology" ,
   BSHM: "BS Hospitality Management" ,
   BSP: "BS Psychology" ,
   BSED_M: "BSED Mathematics" ,
   BSED_E: "BSED English" ,
   BSBM_MM: "BS Business Management (Marketing Management)" ,
  };

  const goToValidatePage = () => {
    router.push(`/student/verify?name=${encodeURIComponent(session?.user.name)}&email=${encodeURIComponent(session?.user.email)}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className='border-0 flex flex-row justify-between px-5 items-center'>
        <CardContent className='flex gap-5'>
          <div className='flex flex-col align-middle gap-3'>
            <h1 className='font-bold text-2xl'>{lastName}, {firstName} {middleName === null ? "" : `${middleName[0]}.`}</h1>
            <h3 className='text-muted-foreground'>Cavite State University</h3>
            <h3 className='text-muted-foreground'>Bacoor Branch</h3>
          </div>
        </CardContent>
        <CardContent className='flex gap-4'>
          {
            emailVerified ?
            null :
            <Button onClick={goToValidatePage} variant={"default"}>
              <Verified className="mr-2 h-4 w-4" /> Verify Email
            </Button>
          }
        </CardContent>
      </Card>

      <div className='flex gap-5 flex-wrap'>
        <Card className="border-0 flex-1">
          <h1 className='px-5 text-2xl font-extrabold'>Information</h1>
          <Separator />
          <div className="px-5 grid grid-cols-2 gap-5">
            <div className='flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Program: {courses[course!]}</h3>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className='text-muted-foreground'>Nationality: {nationality}</h3>
            </div>
            <div className='flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Major: { major === undefined || major === "null" || major === ""  ? "N/A" : major }</h3>
            </div>
            <div className='flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Highschool: { highschool }</h3>
            </div>
            <div className='flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Address: {address}</h3>
            </div>
          </div>
          <Separator />
          <div className='px-5 flex flex-col gap-5'>
            <h3 className='text-muted-foreground'>Date Joined:</h3>
            <i>{joinedDate(createdAt!)}</i>
          </div>
        </Card>
        <div className='flex flex-col gap-5'>
          <Card className="border-0">
            <h1 className='px-5 font-bold'>Verification</h1>
            <Separator />
            <div className='px-5 flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Email:</h3>
              <h2>{emailVerified ? "Verified" : "Not Verified"}</h2>
            </div>
            <div className='px-5 flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Phone:</h3>
              <h2>{phoneVerified ? "Verified" : "Not Verified"}</h2>
            </div>
          </Card>
          <Card className="border-0 px-5">
            <h3 className='text-muted-foreground'>Last Activity:</h3>
            <i>{lastActivity(lastActivityDate.toISOString()!)}</i>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default StudentOverview
