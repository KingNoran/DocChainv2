ALTER TABLE "students" ADD COLUMN "tor_hash" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_expires";