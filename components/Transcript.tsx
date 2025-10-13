"use client";

import { FC, useState, JSX } from "react";
import { useForm, Controller } from "react-hook-form";
import { course, Semester, Subject, TOR, YearChecklist } from "@/app/student/types";
import { subjectChecklists } from "@/app/constants/checklists";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

// Types
interface Student {
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
const TranscriptHeader: FC<{ student: Student; control: any; isFirstPage?: boolean, readOnly?: boolean }> = ({
  student,
  control,
  isFirstPage = true,
  readOnly = false,
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
      <div className="text-center mb-6">
        <h2 className="font-bold text-lg">CAVITE STATE UNIVERSITY</h2>
        <h3 className="font-semibold">BACOOR CAMPUS</h3>
        <p>OFFICE OF THE REGISTRAR</p>
        <h1 className="font-bold text-xl mt-4">
          CHECKLIST FOR THE {courseNames[student.degree as keyof typeof courseNames] || student.degree}
        </h1>
        <p className="text-sm">Revised Curriculum SY 2013-2014</p>
        {!isFirstPage && <p className="text-sm font-semibold">(Continued)</p>}
      </div>

      {isFirstPage && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6">
          {Object.entries(student).map(([key, value]) => {
            if (key === "degree") return null; // skip degree field here, already in header
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
          const semesterObj = yearArray[0]; // defined here
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
const Transcript: FC<TranscriptProps> = ({ initialStudent, initialTranscript, initialGrades, readOnly = false }) => {
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
  
  const handleFinalizeTOR = async() => {

  }

  const handleDownloadPdf = async () => {
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
      // Check if we need a new page for the year title
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = addHeader(false);
      }

      // Add year title
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(year.toUpperCase(), margin, yPos);
      yPos += 7;

      Object.entries(semesters).forEach(([sem, courses]) => {
        // Check if we need a new page for the semester
        if (yPos > pageHeight - 50) {
          pdf.addPage();
          yPos = addHeader(false);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${year.toUpperCase()} (Continued)`, margin, yPos);
          yPos += 7;
        }

        // Add semester title
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        const semesterTitle = sem.replace(/([A-Z])/g, " $1").trim();
        pdf.text(semesterTitle, margin, yPos);
        yPos += 5;

        // Prepare table data
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

        // Add table using autoTable
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
          didDrawPage: (data) => {
            // If table spans multiple pages, add header to new pages
            if (data.pageNumber > 1 && data.cursor) {
              // Header already added by autoTable pagination
            }
          },
        });

        // Update yPos after table
        yPos = (pdf as any).lastAutoTable.finalY + 5;
      });
    });
  }

  pdf.save(`${student.name}-transcript.pdf`);
  }

  const onSubmit = async () => {
  // Get only grades that have changed
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
    /* const res = await fetch(`/api/students/${initialStudent.studentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grades: changedGrades }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      console.log("Transcript updated successfully!");
    } else {
      console.error("Error updating transcript:", result.error);
    } */
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
    console.log(data);
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

  currentPageContent.push(<TranscriptHeader key="header-0" student={student} control={control} isFirstPage={true} readOnly={readOnly} />);
  estimatedHeight = 350;

  if (courseData) {
    Object.entries(courseData).forEach(([year, semesters]) => {
      const yearTitle = <h2 key={`${year}-title`} className="font-bold mt-8 mb-2 uppercase">{year}</h2>;
      if (estimatedHeight + 40 > maxPageHeight && currentPageContent.length > 1) {
        pages.push(<div key={`page-${pageNumber}`} className="page-container">{currentPageContent}</div>);
        pageNumber++;
        currentPageContent = [<TranscriptHeader key={`header-${pageNumber}`} student={student} control={control} isFirstPage={false} readOnly={readOnly} />];
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
            <TranscriptHeader key={`header-${pageNumber}`} student={student} control={control} isFirstPage={false} readOnly={readOnly} />,
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
      <style jsx>{`
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
      <button
        type="button"
        onClick={handleDownloadPdf}
        className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 print:hidden"
      >
        Download PDF
      </button>
      { isRegistrar ? 
      <div className="mt-4">
        <button
        type="button"
        onClick={handleFinalizeTOR}
        className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 print:hidden"
      >
        Finalize TOR
      </button>
      </div>
      : null
      }
    </div>
    </form>
    
  );
};

export default Transcript;
