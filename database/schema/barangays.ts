import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import provinces from './provinces';
import regions from './regions';
import cities from './cities';

const barangays = table("barangays", {
  brgy_code: t.varchar("brgy_code").primaryKey(),
  brgy_name: t.text("brgy_name"),
  city_code: t.varchar("city_code").references(() => cities.city_code),
  province_code: t.varchar("province_code").references(() => provinces.province_code),
  region_code: t.varchar("region_code").references(() => regions.region_code),
})

export default barangays;