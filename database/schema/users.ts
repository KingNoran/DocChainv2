import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import students from './students';
import admins from './admins';
import registrars from './registrars';
import ROLE_ENUM from '../enums/ROLE_ENUM';

const users = table("users",{
    userId: t.uuid("user_id").notNull().primaryKey().defaultRandom().unique(),
    role: ROLE_ENUM("role").default("STUDENT"),
    password: t.text("password").notNull(),
    firstName: t.varchar("first_name", {length: 255}).notNull(),
    middleName: t.varchar("middle_name", {length: 255}).notNull(),
    lastName: t.varchar("last_name", {length: 255}).notNull(),
    email: t.text("email").notNull().unique(),
    phone: t.text("phone").unique(),
    emailVerified: t.boolean("email_verified").default(false),
    phoneVerified: t.boolean("phone_verified").default(false),
    lastActivityDate: t.date("last_activity_date").defaultNow(),
    createdAt: t.timestamp("created_at", {
        mode: "string",
        withTimezone: true,
    }).defaultNow(),
});

export const userRelations = relations(users, ({one})=>({
    student: one(students, {
        fields: [users.userId],
        references: [students.userId],
    }),
    registrar: one(registrars, {
        fields: [users.userId],
        references: [registrars.userId],
    }),
    admin: one(admins, {
        fields: [users.userId],
        references: [admins.userId],
    }),
}));

export default users;