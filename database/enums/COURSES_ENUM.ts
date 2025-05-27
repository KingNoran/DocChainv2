import { pgEnum as list } from "drizzle-orm/pg-core"

const COURSES_ENUM = list ("course", [
    "BSIT",
    "BSCS",
    "BSCRIM",
    "BSHM",
    "BSP",
    "BSED_M",
    "BSED_E",
    "BSBM_MM",
]);

export default COURSES_ENUM;