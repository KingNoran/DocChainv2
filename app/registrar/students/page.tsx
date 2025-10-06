"use client";

import { TOR, CourseGrade } from '@/app/(root)/types';
import { DataTable } from '@/components/registrar/table/DataTable'
import { Student, studentColumns } from '@/components/registrar/table/students/columns';
import React, { useEffect, useState } from 'react'

export async function getStudentTranscript(studentId: string) {
  // Fetch student
  const studentRes = await fetch(`http://localhost:3000/api/students/${studentId}`);
  if (!studentRes.ok) throw new Error("Failed to fetch student");
  const data = await studentRes.json();

  // Assuming your API returns { student, transcript, grades }
  return {
    student: data.student as Student,
    transcript: data.transcript as TOR,
    grades: data.grades as CourseGrade[],
  };
}

const page = () => {
    const [studentData, setStudentData] = useState<any[]>([]);

    useEffect(()=>{
        const fetchStudents = async () => {
        try {
          const studentRes = await fetch("/api/students"); // <-- updated endpoint
          if (!studentRes.ok) {
            throw new Error("Failed to fetch students");
          }
            const data = await studentRes.json();
            setStudentData(data);
          } catch (err: any) {
            console.error("Fetch failed:", err);
          }
        };
        fetchStudents();
    },[])

  return (
    <div>
      <DataTable columns={studentColumns} data={studentData}/>
    </div>
  )
}

export default page
