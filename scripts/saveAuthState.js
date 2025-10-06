// scripts/saveAuthState.ts
import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:3000/api/auth/signin");
  await page.fill('input[name="email"]', 'juls@gmail.com');
  await page.fill('input[name="password"]', 'jalijali123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // Save session state
  await context.storageState({ path: "authState.json" });
  await browser.close();
  console.log("Auth state saved!");
})();