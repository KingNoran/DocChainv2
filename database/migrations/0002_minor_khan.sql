ALTER TABLE "users" ALTER COLUMN "last_activity_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_activity_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "active" boolean DEFAULT false NOT NULL;