import * as t from 'drizzle-orm/pg-core';
import { pgTable as table } from "drizzle-orm/pg-core";
import provinces from './provinces';
import regions from './regions';


const cities = table("cities", {
  city_code: t.varchar("city_code").primaryKey(),
  city_name: t.text("city_name"),
  province_code: t.varchar("province_code").references(() => provinces.province_code),
  region_code: t.varchar("region_code").references(() => regions.region_code),
  psgc_code: t.varchar("psgc_code"),
})

export default cities;