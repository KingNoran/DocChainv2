import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

import users from './users';
import COURSES_ENUM from '../enums/COURSES_ENUM';
import record from './record';

const students = table("students",{
    studentId: t.serial("student_id").notNull().primaryKey().unique(),
    userId: t.uuid("user_id").references(()=>users.userId),
    year: t.integer("year").default(1),
    semester: t.integer("semester").default(1),
    course: COURSES_ENUM("course"),
    finalGrade: t.decimal("final_grade").default("0"),
    torReady: t.boolean().default(false),
});

export const studentsRelations = relations(students, ({one}) => ({
    user: one(users, {
        fields: [students.userId],
        references: [users.userId],
    }),
}));

export default students;