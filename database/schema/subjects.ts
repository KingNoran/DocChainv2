import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import SUBJECTS_ENUM from '../enums/SUBJECTS_ENUM';

const subjects = table("subjects", {
    id: t.serial("id").primaryKey().unique(),
    subjectTitle: SUBJECTS_ENUM().default("Pending"),
    lectureCredit: t.integer("lecture_credit").notNull(),
    laboratoryCredit: t.integer("laboratory_credit").notNull(),
    totalCredit: t.integer("total_credit").notNull(),
    finalGrade: t.decimal("final_grade").default("0"),
    instructor: t.text("instructor").default("PENDING"),
});

export default subjects;