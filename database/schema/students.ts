import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

import users from './users';
import COURSES_ENUM from '../enums/COURSES_ENUM';
import record from './record';

const students = table("students",{
    studentId: t.integer('id').generatedAlwaysAsIdentity().primaryKey(),
    userId: t.uuid("user_id").references(()=>users.userId),
    year: t.integer("year").default(1).notNull(),
    semester: t.integer("semester").default(1).notNull(),
    course: COURSES_ENUM("course").notNull(),
    finalGrade: t.decimal("final_grade").default("0").notNull(),
    torReady: t.boolean().default(false).notNull(),
});

export const studentsRelations = relations(students, ({one}) => ({
    user: one(users, {
        fields: [students.userId],
        references: [users.userId],
    }),
}));

export type students = typeof students;

export default students;