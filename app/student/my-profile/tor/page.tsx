"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TORForm from "@/components/TORForm";
import Transcript from "@/components/Transcript";
import { Input } from "@/components/ui/input";
import { TOR } from "../../types";
import { toast } from "sonner";

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
  email: string;
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
  const [isOTPPhase, setIsOTPPhase] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [transcriptData, setTranscriptData] = useState<TOR | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

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

      // ✅ Fetch student info
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
      setTranscriptData(data.transcript);

      // ✅ Send OTP to student email
      const otpRes = await fetch("/api/email/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: student.email.trim().toLowerCase() }),
      });

      if (!otpRes.ok) throw new Error("Failed to send OTP");
      setOtpMessage(`An OTP has been sent to ${student.email}`);
      setIsOTPPhase(true);

      return { success: true }

    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !studentData) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentData.email, otp }),
      });

      const data = await res.json();
      if (!data.valid) {
        setError(data.error || "Invalid OTP");
        toast.error("Invalid OTP. Please try again.");
        return;
      } 

      // ✅ OTP verified
      setIsVerified(true);
      setIsOTPPhase(false);
      setOtpMessage(null);
      toast.success("Email verified 🎉", {
        description: "Your OTP was correct. You can now view your TOR.",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to verify OTP");
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
    studentId: s.studentId,
    email: s.email,
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
        <p className="text-muted-foreground animate-pulse">Processing...</p>
      ) : isOTPPhase ? (
        <Card className="w-full max-w-md rounded-2xl shadow-xl bg-card border border-border p-6">
          <h2 className="text-xl font-semibold mb-3">Email Verification</h2>
          <p className="text-sm text-muted-foreground mb-4">{otpMessage}</p>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-4"
          />
          <Button className="w-full" onClick={handleVerifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </Card>
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
