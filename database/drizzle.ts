import config from "@/lib/config";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";

const sql = neon(config.env.databaseUrl! as string);

export const db = drizzle({client: sql, logger: true});
