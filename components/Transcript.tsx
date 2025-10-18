"use client";

import { FC, useState, JSX, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { course, Semester, Subject, TOR, YearChecklist } from "@/app/student/types";
import { subjectChecklists } from "@/app/constants/checklists";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { sendRequest } from "@/lib/registrar/actions/sendRequest";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import QRCode from "qrcode";
import { StringHeaderIdentifier } from "@tanstack/react-table";

// Types
export interface Student {
  studentId: number;
  name: string;
  nationality: string;
  birthdate: string;
  graduation: string;
  degree: string;
  major: string;
  highSchool: string;
  address: string;
  entrance: string;
  torHash: string;
}

interface CourseGrade {
  gradeKey: string;
  syTaken: string;
  instructor: string;
  finalRating: string;
}

interface TranscriptProps {
  initialStudent: Student;
  initialTranscript: TOR;
  initialGrades: CourseGrade[];
  readOnly?: boolean;
  isTorReady?: boolean;
}

// Utility
function formatDateForInput(date?: Date | string | null) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

let Paged: any;
if (typeof window !== "undefined") {
  import("pagedjs").then((mod) => {
    Paged = mod;
  });
}

// Header component
// Header component
const TranscriptHeader: FC<{ 
  student: Student; 
  control: any; 
  isFirstPage?: boolean; 
  readOnly?: boolean;
  qrCodeDataUrl?: string;
  isTorReady?: boolean; // add this prop
}> = ({
  student,
  control,
  isFirstPage = true,
  readOnly = false,
  qrCodeDataUrl,
  isTorReady = false,
}) => {
  const courseNames = {
    BSIT: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY (BSIT)",
    BSCS: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE (BSCoS)",
    BSCRIM: "BACHELOR OF SCIENCE IN CRIMINOLOGY (BSCrim)",
    BSHM: "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT (BSHM)",
    BSP: "BACHELOR OF SCIENCE IN PSYCHOLOGY (BSP)",
    BSED_M: "BACHELOR OF SECONDARY EDUCATION MAJOR IN MATHEMATICS (BSEd-Math)",
    BSED_E: "BACHELOR OF SECONDARY EDUCATION MAJOR IN ENGLISH (BSEd-English)",
    BSBM_MM: "BACHELOR OF SCIENCE IN BUSINESS MANAGEMENT MAJOR IN MARKETING MANAGEMENT (BSBM-MM)",
    BSBM_HR: "BACHELOR OF SCIENCE IN BUSINESS MANAGEMENT MAJOR IN HUMAN RESOURCES (BSBM-HR)",
  };

  return (
    <div>
      <div className="text-center mb-6 relative">
        <h2 className="font-bold text-lg">CAVITE STATE UNIVERSITY</h2>
        <h3 className="font-semibold">BACOOR CAMPUS</h3>
        <p>OFFICE OF THE REGISTRAR</p>
        <h1 className="font-bold text-xl mt-4">
          CHECKLIST FOR THE {courseNames[student.degree as keyof typeof courseNames] || student.degree}
        </h1>
        <p className="text-sm">Revised Curriculum SY 2013-2014</p>
        {!isFirstPage && <p className="text-sm font-semibold">(Continued)</p>}
        
        {/* ✅ QR Code in top-right corner only if torReady and torHash exists */}
        {isFirstPage && isTorReady && student.torHash && qrCodeDataUrl && (
          <div className="absolute top-0 right-0">
            <img 
              src={qrCodeDataUrl} 
              alt="Transcript QR Code" 
              className="w-24 h-24"
            />
          </div>
        )}
      </div>

      {isFirstPage && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6">
          {Object.entries(student).map(([key, value]) => {
            if (key === "degree" || key === "torHash" || key === "studentId") return null;
            return (
              <div key={key} className="flex gap-2 justify-between">
                <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <Controller
                  control={control}
                  name={`student.${key}`}
                  render={({ field }) =>
                    readOnly ? (
                      <span className="text-sm text-gray-800">
                        {key.includes("date")
                          ? formatDateForInput(field.value)
                          : field.value || "—"}
                      </span>
                    ) : (
                      <Input
                        {...field}
                        type={key.includes("date") ? "date" : "text"}
                        value={key.includes("date") ? formatDateForInput(field.value) : field.value}
                      />
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// Course Table
const CourseTable: FC<{
  courses: Subject[];
  title: string;
  yearKey: string;
  semesterKey: string;
  control: any;
  grades: Record<string, CourseGrade>;
  initialTranscript: TOR;
  readOnly: boolean;
}> = ({ courses, title, yearKey, semesterKey, control, grades, initialTranscript, readOnly=false, }) => (
  <div className="mb-4 avoid-break">
    <h3 className="font-semibold mb-2 capitalize">{title.replace(/([A-Z])/g, " $1")}</h3>
    <table className="w-full border-collapse border text-xs">
      <thead>
        <tr>
          <th className="border p-1">Course No.</th>
          <th className="border p-1">Course Title</th>
          <th className="border p-1">Lec</th>
          <th className="border p-1">Lab</th>
          <th className="border p-1">Prerequisite(s)</th>
          <th className="border p-1">S.Y. Taken</th>
          <th className="border p-1">Instructor</th>
          <th className="border p-1">Final Rating</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((c, idx) => {
          const gradeKey = `${yearKey}-${semesterKey}-${c.courseCode}`;
          const yearChecklist = initialTranscript?.[yearKey as keyof TOR] as YearChecklist | undefined;
          const yearArray = yearChecklist?.firstYear || [];
          const semesterObj = yearArray[0];
          const semesterArray = semesterObj?.[semesterKey as keyof Semester] as Subject[] | undefined;
          const initialCourse = semesterArray?.find(course => course.courseCode === c.courseCode);

          const grade = grades[`${yearKey}-${semesterKey}-${c.courseCode}`] ?? {
            syTaken: "",
            instructor: initialCourse?.instructor ?? "",
            finalRating: initialCourse?.finalGrade?.toString() ?? "",
          };

          return (
            <tr key={gradeKey}>
              <td className="border p-1">{c.courseCode}</td>
              <td className="border p-1">{c.courseTitle}</td>
              <td className="border p-1">{c.creditUnit.lecture}</td>
              <td className="border p-1">{c.creditUnit.laboratory}</td>
              <td className="border p-1">{Array.isArray(c.preRequisite) ? c.preRequisite.join(", ") : c.preRequisite || "—"}</td>

              {["syTaken", "instructor", "finalRating"].map((field) => (
                <td key={field} className="border p-1">
                  <Controller
                    control={control}
                    name={`grades.${gradeKey}.${field}`}
                    defaultValue={grade[field as keyof CourseGrade]}
                    render={({ field }) =>
                      readOnly ? (
                        <span className="text-xs text-gray-800">
                          {field.value || "—"}
                        </span>
                      ) : (
                        <Input
                          {...field}
                          readOnly={readOnly}
                          className="w-full border-0 px-1 bg-transparent text-xs"
                        />
                      )
                    }/>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// Main Transcript
const Transcript: FC<TranscriptProps> = ({ initialStudent, initialTranscript, initialGrades, isTorReady, readOnly = false }) => {
  const defaultValues = {
    student: initialStudent,
    grades: initialGrades.reduce((acc, g) => {
      acc[g.gradeKey] = g;
      return acc;
    }, {} as Record<string, CourseGrade>),
  };

  const { handleSubmit, control, watch } = useForm({ defaultValues });
  const [initialGradesMap] = useState<Record<string, CourseGrade>>(() => {
    const obj: Record<string, CourseGrade> = {};
    initialGrades.forEach((g) => {
      obj[g.gradeKey] = g;
    });
    return obj;
  });
  
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const qrCodeRef = useRef<string>("");

  // Generate QR Code
  useEffect(() => {
  const generateQRCode = async () => {
    try {
      // Replace with your blockchain transaction link
      const hash = student.torHash; // Get this from your data
      console.log(`TOR HASH NOTICE!!!: ${hash}`)
      const verificationUrl = `https://zksync-sepolia.blockscout.com/tx/${hash}`;
      
      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(dataUrl);
      qrCodeRef.current = dataUrl;
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  generateQRCode();
}, [initialStudent.studentId]);

  const handleFinalizeTOR = async(session: Session) => {
    try{
      const res = await sendRequest({}, session, 'finalizeTor');
      if(res.success){
        toast.success("Request to finalize sent to admin!")
      } else {
        throw new Error(res.error ?? res.message ?? "Unknown error")
      }
    }catch(error){
      toast.error((error as Error).message);
    }
  }

  const handleSendRequest = async(session: Session) => {
    try {
      const res = await sendRequest({}, session, 'requestTor');
      if(res.success){
        toast.success("Request to download sent to admin!")
      } else {
        throw new Error(res.error ?? res.message ?? "Unknown error")
      }
    }catch(error){
      toast.error((error as Error).message);
    }
  }

  const handleDownloadPdf = async () => {
    /* if(!isTorReady && session?.user.role === "STUDENT"){
      toast.error("Invalid transaction", {
        description: "TOR not yet ready. Please contact your registrar."
      })  
      return;
    } */

      //later logic

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    
    const courseNames = {
      BSIT: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY (BSIT)",
      BSCS: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE (BSCoS)",
      BSCRIM: "BACHELOR OF SCIENCE IN CRIMINOLOGY (BSCrim)",
      BSHM: "BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT (BSHM)",
      BSP: "BACHELOR OF SCIENCE IN PSYCHOLOGY (BSP)",
      BSED_M: "BACHELOR OF SECONDARY EDUCATION MAJOR IN MATHEMATICS (BSEd-Math)",
      BSED_E: "BACHELOR OF SECONDARY EDUCATION MAJOR IN ENGLISH (BSEd-English)",
      BSBM_MM: "BACHELOR OF SCIENCE IN BUSINESS MANAGEMENT MAJOR IN MARKETING MANAGEMENT (BSBM-MM)",
      BSBM_HR: "BACHELOR OF SCIENCE IN BUSINESS MANAGEMENT MAJOR IN HUMAN RESOURCES (BSBM-HR)",
    };

    // Helper to add header
    const addHeader = (isFirstPage = true) => {
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("CAVITE STATE UNIVERSITY", pageWidth / 2, margin, { align: "center" });
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("BACOOR CAMPUS", pageWidth / 2, margin + 5, { align: "center" });
  pdf.text("OFFICE OF THE REGISTRAR", pageWidth / 2, margin + 10, { align: "center" });
  
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  const courseTitle = courseNames[student.degree as keyof typeof courseNames] || student.degree;
  const titleLines = pdf.splitTextToSize(`CHECKLIST FOR THE ${courseTitle}`, contentWidth);
  pdf.text(titleLines, pageWidth / 2, margin + 18, { align: "center" });
  
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Revised Curriculum SY 2013-2014", pageWidth / 2, margin + 28, { align: "center" });
  
  if (!isFirstPage) {
    pdf.text("(Continued)", pageWidth / 2, margin + 33, { align: "center" });
  }
  
  // ✅ Only add QR code if torHash exists and TOR is ready
  if (isFirstPage && qrCodeRef.current && isTorReady && student.torHash) {
    const qrSize = 25; // 25mm
    if (isFirstPage && qrCodeRef.current && isTorReady && student.torHash){
      pdf.addImage(qrCodeRef.current, 'PNG', pageWidth - margin - qrSize, margin, qrSize, qrSize);
    }
  }
  
  return isFirstPage ? margin + 38 : margin + 38;
};

    // Add first page header and student info
    let yPos = addHeader(true);
    
    // Add student information on first page
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    
    const studentInfo = [
      [`Name: ${student.name}`, `Nationality: ${student.nationality}`],
      [`Birthdate: ${formatDateForInput(student.birthdate)}`, `Graduation: ${formatDateForInput(student.graduation)}`],
      [`Major: ${student.major}`, `High School: ${student.highSchool}`],
      [`Address: ${student.address}`, `Entrance: ${formatDateForInput(student.entrance)}`],
    ];
    
    studentInfo.forEach(([left, right]) => {
      pdf.text(left, margin, yPos);
      pdf.text(right, pageWidth / 2 + 5, yPos);
      yPos += 5;
    });
    
    yPos += 5;

    const degreeKey = student.degree as course;
    const courseData = degreeKey ? subjectChecklists[degreeKey] : null;

    if (courseData) {
      Object.entries(courseData).forEach(([year, semesters]) => {
        if (yPos > pageHeight - 60) {
          pdf.addPage();
          yPos = addHeader(false);
        }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(year.toUpperCase(), margin, yPos);
        yPos += 7;

        Object.entries(semesters).forEach(([sem, courses]) => {
          if (yPos > pageHeight - 50) {
            pdf.addPage();
            yPos = addHeader(false);
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            pdf.text(`${year.toUpperCase()} (Continued)`, margin, yPos);
            yPos += 7;
          }

          pdf.setFontSize(9);
          pdf.setFont("helvetica", "bold");
          const semesterTitle = sem.replace(/([A-Z])/g, " $1").trim();
          pdf.text(semesterTitle, margin, yPos);
          yPos += 5;

          const tableData = (courses as Subject[]).map((c) => {
            const gradeKey = `${year}-${sem}-${c.courseCode}`;
            const grade = grades[gradeKey] ?? {
              syTaken: "",
              instructor: "",
              finalRating: "",
            };

            return [
              c.courseCode,
              c.courseTitle,
              c.creditUnit.lecture.toString(),
              c.creditUnit.laboratory.toString(),
              Array.isArray(c.preRequisite) ? c.preRequisite.join(", ") : c.preRequisite || "—",
              grade.syTaken || "—",
              grade.instructor || "—",
              grade.finalRating || "—",
            ];
          });

          autoTable(pdf, {
            startY: yPos,
            head: [["Course No.", "Course Title", "Lec", "Lab", "Prerequisite(s)", "S.Y. Taken", "Instructor", "Final Rating"]],
            body: tableData,
            margin: { left: margin, right: margin },
            styles: {
              fontSize: 7,
              cellPadding: 1,
              overflow: "linebreak",
            },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontStyle: "bold",
              lineWidth: 0.1,
              lineColor: [0, 0, 0],
            },
            bodyStyles: {
              lineWidth: 0.1,
              lineColor: [0, 0, 0],
            },
            columnStyles: {
              0: { cellWidth: 20 },
              1: { cellWidth: 50 },
              2: { cellWidth: 10 },
              3: { cellWidth: 10 },
              4: { cellWidth: 30 },
              5: { cellWidth: 20 },
              6: { cellWidth: 25 },
              7: { cellWidth: 15 },
            },
          });

          yPos = (pdf as any).lastAutoTable.finalY + 5;
        });
      });
    }

    pdf.save(`${student.name}-transcript.pdf`);
  }

  const onSubmit = async () => {
    const changedGrades = Object.values(grades).filter(g => {
      const initial = initialGradesMap[g.gradeKey];
      return (
        !initial ||
        g.syTaken !== initial.syTaken ||
        g.instructor !== initial.instructor ||
        g.finalRating !== initial.finalRating
      );
    });

    if (changedGrades.length === 0) {
      console.log("No changes detected. Skipping PATCH request.");
      return;
    }

    try {
      const res = await fetch(`/api/students/${initialStudent.studentId}/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedGrades),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Transcript Edited successfully", {
          action: {
            label: "Got it",
            onClick: () => console.log("Success"),
          },
        });
      } else {
        toast.error("Error updating transcript", {
          action: {
            label: "Got it",
            onClick: () => console.log("Error"),
          }
        })
      }
    } catch (err) {
      console.error(err);
    }
  };

  const student = watch("student");
  const grades = watch("grades");
  const pathname = usePathname();
  const isRegistrar = pathname.includes("/registrar");
  const degreeKey = student.degree as course;
  const courseData = degreeKey ? subjectChecklists[degreeKey] : null;

  // Page splitting logic
  const pages: JSX.Element[] = [];
  let currentPageContent: JSX.Element[] = [];
  let estimatedHeight = 0;
  const maxPageHeight = 950;
  let pageNumber = 0;
  const {data: session} = useSession();

  currentPageContent.push(
    <TranscriptHeader 
      key="header-0" 
      student={student} 
      control={control} 
      isFirstPage={true} 
      readOnly={readOnly}
      qrCodeDataUrl={qrCodeDataUrl}
      isTorReady={isTorReady}
    />
  );
  estimatedHeight = 350;

  if (courseData) {
    Object.entries(courseData).forEach(([year, semesters]) => {
      const yearTitle = <h2 key={`${year}-title`} className="font-bold mt-8 mb-2 uppercase">{year}</h2>;
      if (estimatedHeight + 40 > maxPageHeight && currentPageContent.length > 1) {
        pages.push(<div key={`page-${pageNumber}`} className="page-container">{currentPageContent}</div>);
        pageNumber++;
        currentPageContent = [
          <TranscriptHeader 
            key={`header-${pageNumber}`} 
            student={student} 
            control={control} 
            isFirstPage={false} 
            readOnly={readOnly}
            isTorReady={isTorReady}
          />
        ];
        estimatedHeight = 150;
      }

      currentPageContent.push(yearTitle);
      estimatedHeight += 40;

      Object.entries(semesters).forEach(([sem, courses]) => {
        const semesterHeight = (courses as any[]).length * 24 + 80;
        if (estimatedHeight + semesterHeight > maxPageHeight && currentPageContent.length > 2) {
          pages.push(<div key={`page-${pageNumber}`} className="page-container">{currentPageContent}</div>);
          pageNumber++;
          currentPageContent = [
            <TranscriptHeader 
              key={`header-${pageNumber}`} 
              student={student} 
              control={control} 
              isFirstPage={false} 
              readOnly={readOnly}
              isTorReady={isTorReady}
            />,
            <h2 key={`${year}-title-${pageNumber}`} className="font-bold mt-4 mb-2 uppercase">{year} (Continued)</h2>,
          ];
          estimatedHeight = 200;
        }

        currentPageContent.push(
          <CourseTable
            key={`${year}-${sem}`}
            courses={courses as any[]}
            title={sem}
            yearKey={year}
            semesterKey={sem}
            control={control}
            grades={grades}
            initialTranscript={initialTranscript}
            readOnly={readOnly}
          />
        );
        estimatedHeight += semesterHeight;
      });
    });
  }

  if (currentPageContent.length > 0) {
    pages.push(<div key={`page-${pageNumber}`} className="page-container">{currentPageContent}</div>);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="download">
      <div className="transcript-pages" id="transcript-pages">
        {pages.map((page, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg border mx-auto mb-6 overflow-hidden print:shadow-none print:mb-0"
            style={{ width: "210mm", minHeight: "297mm", padding: "20mm", boxSizing: "border-box", position: "relative" }}
          >
            {page}
          </div>
        ))}
      </div>
      {isRegistrar ? 
      <div className="text-center mt-6">
        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 print:hidden">
          Update Transcript
        </button>
      </div> : null}
      <style>{`
        .page-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .avoid-break {
          break-inside: avoid;
        }
        @media print {
          .transcript-pages {
            break-inside: auto;
          }
          .page-container {
            break-after: page;
          }
          .page-container:last-child {
            break-after: auto;
          }
        }
      `}</style>
      <div className="text-center mt-4">
      {isTorReady || pathname.includes("/admin")?
        <button
        type="button"
        onClick={handleDownloadPdf}
        className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 print:hidden"
      >
        Download PDF
      </button> : 
      <button
        type="button"
        onClick={!isRegistrar ? ()=>handleSendRequest(session!) : ()=>handleFinalizeTOR(session!)}
        className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 print:hidden"
      >
        {!isRegistrar ? "Request TOR" : "Finalize TOR"}
      </button>
      }
    </div>
    </form>
  );
};

export default Transcript;