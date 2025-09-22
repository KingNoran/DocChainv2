"use server";

import { Semester, Student, Subject, TOR } from "@/app/(root)/types";
import { subjectChecklists } from "@/app/constants/checklists";
import { db } from "@/database/drizzle";
import { record, semesters, subjects } from "@/database/schema";
import { eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

export const createTOR = async (student: Student) => {
  try {
    return await db.transaction(async (tx) => {
      // Check if record exists
      const existingTOR = await tx
        .select()
        .from(record)
        .where(eq(record.studentId, student.studentId))
        .limit(1);

      if (existingTOR.length > 0) {
        return { success: false, error: "TOR already exists" };
      }

      // Create new TOR record
      const [newTOR] = await tx
        .insert(record)
        .values({
          studentId: student.studentId,
        })
        .returning();

      // Get the course data from checklist
      const courseKey = student.course.toUpperCase() as keyof typeof subjectChecklists;
      const courseData = subjectChecklists[courseKey];
      if (!courseData) {
        return { success: false, message: "No checklist for this course" };
      }

      // Iterate dynamically over years and semesters
      for (const [yearKey, yearData] of Object.entries(courseData)) {
        for (const [semKey, semData] of Object.entries(yearData)) {
          // Insert semester record
          const [newSem] = await tx
            .insert(semesters)
            .values({
              transcriptId: newTOR.id,
              year: yearKey,
              semester: semKey,
            })
            .returning();

          // Insert subjects
          const result = await setSubjectsFromData(
            tx,
            semData as Subject[],
            newTOR,
            newSem
          );
          if (!result.success) throw new Error(result.message); // triggers rollback
        }
      }

      return {
        success: true,
        data: JSON.parse(JSON.stringify(newTOR)),
      };
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Error occurred while making TOR: ${error instanceof Error ? error.message : error}`
    };
  }
};


// Insert subjects helper
const setSubjectsFromData = async (
  tx: PgTransaction<any, any, any>,
  semData: Subject[],
  newTOR: TOR,
  newSem: Semester
) => {
    if (!semData || semData.length === 0) {
        return { success: false, message: "No subjects found" };
    }

    for (const subject of semData) {
        try {
        await tx.insert(subjects).values({
            courseCode: subject.courseCode,
            courseTitle: subject.courseTitle,
            creditUnit: subject.creditUnit,
            contactHours: 
            subject.contactHrs ?? { lecture: 0, laboratory: 0 }
            ,
            preRequisite: subject.preRequisite,
            finalGrade: String(subject.finalGrade ?? ""),
            instructor: subject.instructor,
            transcriptId: newTOR.id,
            semesterId: newSem.id,
        });
        } catch (error) {
        console.error("Insert failed for", subject.courseCode, error);
        return { success: false, message: "Error inserting Subject" };
        }
    }

    return { success: true, message: "Subjects inserted successfully" };
};
