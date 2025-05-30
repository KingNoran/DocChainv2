import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import users from './users';
import students from './students';
import { relations } from 'drizzle-orm';

const record = table("record", {
    studentId: t.integer("student_id").references(()=>students.studentId),
    userId: t.integer("user_id").references(()=>users.userId),
    firstYear: t.json("first_year_record"),
    secondYear: t.json("second_year_record"),
    midYear: t.json("mid_year_record"),
    midYear1: t.json("mid_year1_record"),
    midYear2: t.json("mid_year2_record"),
    thirdYear: t.json("third_year_record"),
    fourthYear: t.json("fourth_year_record"),
    privateKey: t.text("private_key")
})

export const recordRelationships = relations(record, ({one})=>({
    student: one(students, {
        fields: [record.studentId],
        references: [students.studentId]
    }),
    user: one(users, {
        fields: [record.userId],
        references: [users.userId],
    }),
}));

export default record;