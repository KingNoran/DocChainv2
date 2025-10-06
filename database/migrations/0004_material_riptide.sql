ALTER TABLE "students" ALTER COLUMN "highschool" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isArchived" boolean DEFAULT false NOT NULL;