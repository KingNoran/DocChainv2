ALTER TABLE "requests" ALTER COLUMN "validated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "year" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "semester" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "course" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "final_grade" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "torReady" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone_verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_activity_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "request_content" jsonb NOT NULL;