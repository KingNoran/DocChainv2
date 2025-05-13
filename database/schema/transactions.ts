import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import users from './users';
import { relations } from 'drizzle-orm';

const transactions = table("transactions", {
    userId: t.uuid("user_id").references(()=>users.userId),
    activity: t.text("activity").notNull(),
    createdAt: t.timestamp("created_at", {
        mode: "string",
        withTimezone: true,
    }).defaultNow(),
});

export default transactions;