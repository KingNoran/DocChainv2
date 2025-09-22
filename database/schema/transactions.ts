import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import users from './users';

const transactions  = table("transactions", {
    id: t.integer('id').generatedAlwaysAsIdentity().primaryKey(),
    userId: t.uuid("user_id").references(()=>users.userId),
    hash: t.text("hash").notNull().unique(),
    tokenId: t.text("token_id").notNull().unique(),
    pdfHash: t.text("pdf_hash").notNull().unique(),
});

export default transactions;