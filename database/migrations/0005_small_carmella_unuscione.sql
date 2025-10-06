ALTER TABLE "users" RENAME COLUMN "isArchived" TO "archive";--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "archive" boolean DEFAULT false NOT NULL;