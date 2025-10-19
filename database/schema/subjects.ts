import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import record from './record';
import { relations } from 'drizzle-orm';
import semesters from './semester';

const subjects = table("subjects", {
    id: t.uuid('id').defaultRandom().primaryKey(),
    transcriptId: t.uuid('transcript_id').references(() => record.id, { onDelete: 'cascade' }).notNull(),
    semesterId: t.uuid('semester_id').references(()=> semesters.id, { onDelete: 'cascade' }).notNull(),
    courseCode: t.text('course_code').notNull(),
    syTaken: t.text('school_year'),
    courseTitle: t.text('course_title').notNull(),
    creditUnit: t.jsonb('credit_unit').notNull(),
    contactHours: t.jsonb('contact_hours'),
    preRequisite: t.text('pre_requisite'),
    finalGrade: t.decimal("final_grade", { precision: 3, scale: 1 }).default("0"),
    instructor: t.text("instructor").default("PENDING"),
});

export const subjectsRelationships = relations(subjects, ({ one,many }) => ({
  semester: one(semesters, {
    fields: [subjects.semesterId],
    references: [semesters.id],
  }),
}));


export default subjects;