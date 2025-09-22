import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";

import { relations } from 'drizzle-orm';
import users from './users';

const registrars = table("registrars", {
    id: t.integer('id').generatedAlwaysAsIdentity().primaryKey(),
    userId: t.uuid("user_id").references(()=>users.userId),
});

export const registrarsRelations = relations(registrars, ({one}) => ({
    user: one(users, {
        fields: [registrars.userId],
        references: [users.userId],
    }),
}));

export default registrars;