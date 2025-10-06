import config from "@/lib/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "@/database/schema"

const pool = new Pool({ connectionString: config.env.databaseUrl! });

export const db = drizzle(pool, { schema, logger: true });
