import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import students from './students';
import { relations } from 'drizzle-orm';
import semesters from './semester';

const record = table("record", {
    id: t.uuid('id').defaultRandom().primaryKey(),
    studentId: t.integer('student_id').references(()=>students.studentId, { onDelete: 'cascade'}).notNull(), 
    createdAt: t.timestamp('created_at').defaultNow()                                                                                                                                                                                                                           .notNull(),
    updatedAt: t.timestamp('updated_at').defaultNow().notNull(),
})

export const recordRelationships = relations(record, ({one, many})=>({
    semesters: many(semesters),
    student: one(students, {
        fields: [record.studentId],
        references: [students.studentId]
    }),
}));

export default record;