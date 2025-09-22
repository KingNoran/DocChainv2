import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import users from './users';
import { relations } from 'drizzle-orm';

const admins = table("admins", {
    adminId: t.integer('id').generatedAlwaysAsIdentity().notNull().primaryKey().unique(),
    userId: t.uuid("user_id").references(()=>users.userId),
});


export const adminRelations = relations(admins, ({one})=>({
    user: one(users, {
        fields: [admins.userId],
        references: [users.userId]
    })
}));

export default admins;