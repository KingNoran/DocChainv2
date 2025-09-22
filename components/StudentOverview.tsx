import { StudentOverviewTemplate } from '@/app/(root)/types'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { LogOut } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { logout } from '@/lib/actions/logout'


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
}: StudentOverviewTemplate) => {
  
  const {data: session} = useSession();
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
          <Button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white">
            <LogOut className="mr-2 h-4 w-4" /> Logout
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
