import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import users from './users';
import { relations } from 'drizzle-orm';
import admins from './admins';
import STATUS_ENUM from '../enums/STATUS_ENUM';

const requests = table("requests", {
    id: t.serial("id").primaryKey().unique(),
    requesterId: t.uuid("requester_id").references(()=>users.userId),
    validatorId: t.uuid("validator_id").references(()=>users.userId),
    activity: t.text("activity").notNull(),
    status: STATUS_ENUM("status").default("PENDING"),
    createdAt: t.timestamp("created_at", {
        mode: "string",
        withTimezone: true,
    }).defaultNow(),
    validatedAt: t.timestamp("validated_at", {
        mode: "string",
        withTimezone: true,
    }).defaultNow(),
});

export default requests;