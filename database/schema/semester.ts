import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import record from './record';
import { relations } from 'drizzle-orm';
import subjects from './subjects';

const semesters = table('transcript_semesters', {
  id: t.uuid('id').defaultRandom().primaryKey(),
  transcriptId: t.uuid('transcript_id').references(() => record.id, { onDelete: 'cascade' }).notNull(),
  year: t.text('year').notNull(), // firstYear, secondYear, etc.
  semester: t.text('semester').notNull(), // firstSem, secondSem
  createdAt: t.timestamp('created_at').defaultNow().notNull(),
});

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  transcript: one(record, {
    fields: [semesters.transcriptId],
    references: [record.id],
  }),
  courses: many(subjects),
}));

export default semesters;