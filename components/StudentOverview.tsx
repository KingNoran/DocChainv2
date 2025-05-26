import { Student} from '@/app/(root)/types'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Separator } from './ui/separator'


const StudentOverview = ({
    studentId,
    userId,
    course,
    year,
    semester,
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
    createdAt
}: Student) => {
  
  const studentYear = (year: number)=>{
    switch(year!){
      case 1:
        return "First Year";
      case 2:
        return "Second Year";
      case 3:
        return "Third Year";
      case 4:
        return "Fourth Year";
      default:
        return "Invalid Input";
    }
  }

  const studentSemester = (semester : number)=>{
    if(semester == 1) return "First Sem";
    else if (semester == 2) return "Second Sem";
    else return "Invalid Input";
  }

  const joinedDate = (createdAt : string)=>
    {
      return new Date(createdAt).toUTCString()
    };

  const lastActivity = (lastActivityDate : string)=>{
    return new Date(lastActivityDate).toUTCString()
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className='border-0 flex flex-row justify-between px-5 items-center'>
        <CardContent className='flex gap-5'>
          <div>
            Avatar
          </div>
          <div className='flex flex-col align-middle gap-3'>
            <h1 className='font-bold text-2xl'>{lastName}, {firstName} {middleName === null ? "" : `${middleName[0]}.`}</h1>
            <h3 className='text-muted-foreground'>Cavite State University</h3>
            <h3 className='text-muted-foreground'>Bacoor Branch</h3>
          </div>
        </CardContent>
        <CardContent>
          <Button>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.8687 2.86883C11.0163 2.71602 11.1928 2.59412 11.3881 2.51027C11.5833 2.42642 11.7932 2.38228 12.0057 2.38043C12.2181 2.37859 12.4288 2.41907 12.6254 2.49952C12.8221 2.57997 13.0007 2.69877 13.1509 2.849C13.3012 2.99923 13.42 3.17787 13.5004 3.37451C13.5809 3.57114 13.6214 3.78183 13.6195 3.99427C13.6177 4.20672 13.5735 4.41667 13.4897 4.61188C13.4058 4.80709 13.2839 4.98364 13.1311 5.13123L12.4967 5.76563L10.2343 3.50323L10.8687 2.86883ZM9.1031 4.63443L2.3999 11.3376V13.6H4.6623L11.3663 6.89683L9.1031 4.63443Z" fill="black"/>
            </svg> Edit Profile
          </Button>
        </CardContent>
      </Card>

      <div className='flex gap-5 flex-wrap'>
        <Card className="border-0 flex-1">
          <h1 className='px-5 text-2xl font-extrabold'>Information</h1>
          <Separator />
          <div className="px-5 grid grid-cols-2 gap-5">
            <div className='flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Year:</h3>
              <i>{studentYear(year!)}</i>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className='text-muted-foreground'>Course:</h3>
              <i>{course}</i>
            </div>
            <div className='flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Semester:</h3>
              <i>{studentSemester(semester!)}</i>
            </div>
            <div className='flex flex-col gap-5'>
              <h3 className='text-muted-foreground'>Section:</h3>
              <i>{course}{year}{semester}1</i>
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
            <i>{lastActivity(lastActivityDate!)}</i>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default StudentOverview
