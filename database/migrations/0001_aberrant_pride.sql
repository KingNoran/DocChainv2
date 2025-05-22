CREATE TYPE "public"."status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"requester_id" uuid,
	"validator_id" uuid,
	"activity" text NOT NULL,
	"status" "status" DEFAULT 'PENDING',
	"created_at" timestamp with time zone DEFAULT now(),
	"validated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "transactions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STUDENT';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "middle_name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "middle_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "record" ADD COLUMN "private_key" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_requester_id_users_user_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_validator_id_users_user_id_fk" FOREIGN KEY ("validator_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_id_unique" UNIQUE("id");