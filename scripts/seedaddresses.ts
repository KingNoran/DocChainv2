// 👇 MUST be first
import 'dotenv/config';

import fs from "fs";
import path from "path";
import { barangays, cities, provinces, regions } from "@/database/schema";
import { db } from '@/database/drizzle';

// 3️⃣ Seed function
async function seed() {
  console.log("🌱 Seeding Philippine address data...");

  const regionsData = JSON.parse(fs.readFileSync(path.resolve("app/constants/region.json"), "utf8"));
  const provincesData = JSON.parse(fs.readFileSync(path.resolve("app/constants/province.json"), "utf8"));
  const citiesData = JSON.parse(fs.readFileSync(path.resolve("app/constants/city.json"), "utf8"));
  const barangaysData = JSON.parse(fs.readFileSync(path.resolve("app/constants/barangay.json"), "utf8"));

  await db.delete(barangays);
  await db.delete(cities);
  await db.delete(provinces);
  await db.delete(regions);

  console.log("Inserting regions...");
  await db.insert(regions).values(regionsData);

  console.log("Inserting provinces...");
  await db.insert(provinces).values(provincesData);

  console.log("Inserting cities...");
  await db.insert(cities).values(citiesData);

  console.log("Inserting barangays...");
  const chunkSize = 2000;
  for (let i = 0; i < barangaysData.length; i += chunkSize) {
    const chunk = barangaysData.slice(i, i + chunkSize);
    await db.insert(barangays).values(chunk);
    console.log(`Inserted ${i + chunk.length}/${barangaysData.length}`);
  }

  console.log("✅ Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
