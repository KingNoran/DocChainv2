import { pgEnum as list } from "drizzle-orm/pg-core"

const STATUS_ENUM = list("status", ["PENDING", "APPROVED", "REJECTED"]);

export default STATUS_ENUM;