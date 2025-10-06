"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import TORForm from "@/components/TORForm";
import Transcript from "@/components/Transcript";
import { TOR } from "../../types";

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
}

type CourseGrade = {
  gradeKey: string;
  syTaken: string;
  instructor: string;
  finalRating: string;
};

interface VerifyTORResponse {
  valid: boolean;
  student?: Student;
  transcript?: TOR;
  error?: string;
}

const mapTranscriptToGrades = (transcript: TOR): CourseGrade[] => {
  const grades: CourseGrade[] = [];

  Object.entries(transcript).forEach(([yearKey, yearData]) => {
    const yearChecklist = yearData as any;
    Object.entries(yearChecklist).forEach(([semesterKey, courses]: [string, any]) => {
      (courses as any[]).forEach((c) => {
        grades.push({
          gradeKey: `${yearKey}-${semesterKey}-${c.courseCode}`,
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
  const [isVerified, setIsVerified] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [transcriptData, setTranscriptData] = useState<TOR | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courseGrades = transcriptData ? mapTranscriptToGrades(transcriptData) : [];

  const verifyTOR = async ({ studentUUID }: { studentUUID: string }) => {
    setLoading(true);
    setError(null);
    setIsVerified(false);

    try {
      
      const res = await fetch("/api/verify-tor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentUUID }),
      });

      const data: VerifyTORResponse = await res.json();

      if (!res.ok || !data.valid || !data.student || !data.transcript) {
        setError(data.error || "Invalid TOR or missing data");
        return { success: false, error: data.error || "Invalid TOR" };
      }

      const studentRes = await fetch(`/api/students?studentId=${data.student.studentId}`);
        if (!studentRes.ok) throw new Error("Failed to fetch student");
        const studentArr: Student[] = await studentRes.json();
        if (studentArr.length === 0) {
          setError("Student not found");
          setLoading(false);
          return;
        }
        const student = studentArr[0];
        setStudentData(student);
      // ✅ Update state
      setTranscriptData(data.transcript);
      setIsVerified(true);

      return { success: true };
    } catch (err) {
      console.error(err);
      setError("Network error");
      return { success: false, error: "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const mapStudentToTranscript = (s: Student) => ({
        name: `${s.firstName} ${s.middleName ?? ""} ${s.lastName}`.trim(),
        nationality: s.nationality ?? "",
        birthdate: new Date(s.birthday).toLocaleDateString(),
        graduation: new Date(s.dateGraduated).toLocaleDateString(),
        degree: s.course,
        major: s.major ?? "",
        highSchool: s.highschool ?? "",
        address: s.address ?? "",
        entrance: new Date(s.dateEntrance).toLocaleDateString(),
        studentId: s.studentId
      });

  return (
    <div className="flex min-h-[80vh] items-center justify-center font-inter px-2 sm:px-4 md:px-8">
      {isVerified && studentData && transcriptData ? (
        <Transcript
          initialStudent={mapStudentToTranscript(studentData)}
          initialTranscript={transcriptData}
          initialGrades={courseGrades}
          readOnly={true}
        />
      ) : loading ? (
        <p className="text-muted-foreground animate-pulse">Loading transcript...</p>
      ) : (
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-xl bg-card border border-border p-4 sm:p-8 text-card-foreground">
          <div className="mb-2">
            <h2 className="text-2xl sm:text-3xl font-normal text-foreground leading-8 sm:leading-10 mb-2">
              View Your Transcript of Records
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-normal mb-6">
              Enter your TOR Hash to access your official TOR securely.
            </p>
          </div>
          <TORForm onSubmit={verifyTOR} />
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </Card>
      )}
    </div>
  );
};

export default Page;
