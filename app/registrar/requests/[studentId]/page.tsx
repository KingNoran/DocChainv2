"use client"

import { TOR } from '@/app/student/types';
import Transcript from '@/components/Transcript';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Student {
  studentId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  year: number;
  semester: string;
  course: string;
  torReady: boolean;
  nationality: string;
  address: string;
  birthday: Date;
  major: string;
  highschool: string;
  dateEntrance: Date;
  dateGraduated: Date;
  isArchived: boolean;
  torHash: string;
}

type CourseGrade = {
  gradeKey: string; // e.g., "firstYear-firstSem-CS101"
  syTaken: string;
  instructor: string;
  finalRating: string;
};

const mapTranscriptToGrades = (transcript: TOR): CourseGrade[] => {
  const grades: CourseGrade[] = [];

  Object.entries(transcript).forEach(([yearKey, yearData]) => {
    const yearChecklist = yearData as any; // adjust typing if needed
    Object.entries(yearChecklist).forEach(([semesterKey, courses]: [string, any]) => {
      (courses as any[]).forEach((c) => {
        const gradeKey = `${yearKey}-${semesterKey}-${c.courseCode}`;
        grades.push({
          gradeKey: gradeKey,
          syTaken: "",
          instructor: c.instructor || "",
          finalRating: c.finalGrade?.toString() || "",
        });
      });
    });
  });

  return grades;
};

const Page = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [transcriptData, setTranscriptData] = useState<TOR | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const courseGrades = transcriptData ? mapTranscriptToGrades(transcriptData) : [];

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentTOR = async () => {
      try {
        // 1. Fetch student info
        const studentRes = await fetch(`/api/students/?studentId=${studentId}`);
        if (!studentRes.ok) throw new Error("Failed to fetch student");
        const studentArr: Student[] = await studentRes.json();
        if (studentArr.length === 0) {
          setError("Student not found");
          setLoading(false);
          return;
        }
        const student = studentArr[0];
        setStudentData(student);

        // 2. Fetch transcript info
        const transcriptRes = await fetch(`/api/students/${studentId}`);
        if (!transcriptRes.ok) throw new Error("Failed to fetch transcript");
        const transcriptPayload = await transcriptRes.json();
        setTranscriptData(transcriptPayload.transcript);

      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentTOR();
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!studentData) return <div>No student data</div>;

  const birthday = new Date(studentData.birthday);
  const dateEntrance = new Date(studentData.dateEntrance);
  const dateGraduated = new Date(studentData.dateGraduated);
  
  const mapStudentToTranscript = (s: Student) => ({
    name: `${s.firstName} ${s.middleName ?? ""} ${s.lastName}`.trim(),
    nationality: s.nationality ?? "",
    birthdate: birthday.toLocaleDateString(),
    graduation: dateGraduated.toLocaleDateString(),
    degree: s.course,
    major: s.major ?? "",
    highSchool: s.highschool ?? "",
    address: s.address ?? "",
    entrance: dateEntrance.toLocaleDateString(),
    studentId: s.studentId,
    torHash: s.torHash
  });
  
  const transcriptStudent = mapStudentToTranscript(studentData!);
  return (
    <div>
      <h2 className="mt-6 font-bold">Transcript Data</h2>
      <h2 className="mt-6 font-bold">Student ID: {studentData.studentId}</h2>
      {/* {!transcriptData ? (
        <p>No transcript data found</p>
      ) : (
        <div>
          {Object.entries(transcriptData).map(([year, semesters]) => (
            <div key={year} className="mb-4">
              <h3 className="font-semibold text-lg">{year}</h3>
              {Object.entries(semesters).map(([semester, courses]) => (
                <div key={semester} className="ml-4 mb-2">
                  <h4 className="font-medium">{semester}</h4>
                  <ul className="list-disc pl-6">
                    {(courses as TranscriptData[string][string]).map((course) => (
                      <li key={course.courseCode}>
                        <p><strong>{course.courseCode}</strong> - {course.courseTitle}</p>
                        <p>Instructor: {course.instructor || "—"}</p>
                        <p>Final Grade: {course.finalGrade || "—"}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )} */}
      <Transcript 
      initialStudent={transcriptStudent} 
      initialTranscript={transcriptData!} 
      initialGrades={courseGrades}
      isTorReady={studentData.torReady}
      />
      
    </div>

  );
}

export default Page;

