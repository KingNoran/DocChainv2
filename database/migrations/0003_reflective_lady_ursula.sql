ALTER TABLE "students" ADD COLUMN "tor_ready" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "major" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "date_graduated" date;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "highschool" text;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "date_entrace" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nationality" text DEFAULT 'Filipino';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birthday" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "torReady";