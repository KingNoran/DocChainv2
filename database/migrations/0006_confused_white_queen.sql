CREATE TABLE "barangays" (
	"brgy_code" varchar PRIMARY KEY NOT NULL,
	"brgy_name" text,
	"city_code" varchar,
	"province_code" varchar,
	"region_code" varchar
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"city_code" varchar PRIMARY KEY NOT NULL,
	"city_name" text,
	"province_code" varchar,
	"region_code" varchar,
	"psgc_code" varchar
);
--> statement-breakpoint
CREATE TABLE "provinces" (
	"province_code" varchar PRIMARY KEY NOT NULL,
	"province_name" text,
	"psgc_code" varchar,
	"region_code" varchar
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"region_code" varchar PRIMARY KEY NOT NULL,
	"region_name" text,
	"psgc_code" varchar
);
--> statement-breakpoint
ALTER TABLE "barangays" ADD CONSTRAINT "barangays_city_code_cities_city_code_fk" FOREIGN KEY ("city_code") REFERENCES "public"."cities"("city_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barangays" ADD CONSTRAINT "barangays_province_code_provinces_province_code_fk" FOREIGN KEY ("province_code") REFERENCES "public"."provinces"("province_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barangays" ADD CONSTRAINT "barangays_region_code_regions_region_code_fk" FOREIGN KEY ("region_code") REFERENCES "public"."regions"("region_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_province_code_provinces_province_code_fk" FOREIGN KEY ("province_code") REFERENCES "public"."provinces"("province_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_region_code_regions_region_code_fk" FOREIGN KEY ("region_code") REFERENCES "public"."regions"("region_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_region_code_regions_region_code_fk" FOREIGN KEY ("region_code") REFERENCES "public"."regions"("region_code") ON DELETE no action ON UPDATE no action;