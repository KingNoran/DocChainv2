import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";

const regions = table("regions", {
  region_code: t.varchar("region_code").primaryKey(),
  region_name: t.text("region_name"),
  psgc_code: t.varchar("psgc_code"),
})

export default regions;