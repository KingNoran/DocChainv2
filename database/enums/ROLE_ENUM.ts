import { pgEnum as list } from "drizzle-orm/pg-core"

const ROLE_ENUM = list("user_role", ["STUDENT", "REGISTRAR", "ADMIN"]);

export default ROLE_ENUM;