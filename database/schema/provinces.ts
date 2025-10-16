import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import regions from './regions';


const provinces = table("provinces", {
  province_code: t.varchar("province_code").primaryKey(),
  province_name: t.text("province_name"),
  psgc_code: t.varchar("psgc_code"),
  region_code: t.varchar("region_code").references(() => regions.region_code),
})

export default provinces;