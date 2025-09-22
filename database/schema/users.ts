import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import students from './students';
import admins from './admins';
import registrars from './registrars';
import ROLE_ENUM from '../enums/ROLE_ENUM';
import transactions from './requests';

const users = table("users",{
    userId: t.uuid("id").notNull().primaryKey().defaultRandom().unique(),
    role: t.text("role").default("STUDENT").notNull(),
    password: t.text("password").notNull(),
    firstName: t.varchar("first_name", {length: 255}).notNull(),
    middleName: t.varchar("middle_name", {length: 255}).default(""),
    lastName: t.varchar("last_name", {length: 255}).notNull(),
    email: t.text("email").notNull().unique(),
    phone: t.text("phone").notNull().unique(),
    emailVerified: t.boolean("email_verified").default(false).notNull(),
    phoneVerified: t.boolean("phone_verified").default(false).notNull(),
    lastActivityDate: t.date("last_activity_date").defaultNow().notNull(),
    createdAt: t.timestamp("created_at", {
        mode: "string",
        withTimezone: true,
    }).defaultNow().notNull(),
});

export const userRelations = relations(users, ({one, many})=>({
    transactions: many(transactions),
    students: many(students),
    registrars: many(registrars),
    admins: many(admins),
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
    requester: one(transactions, {
        fields: [users.userId],
        references: [transactions.requesterId]
    }),
    validator: one(transactions, {
        fields: [users.userId],
        references: [transactions.validatorId]
    })
}));

export default users;