import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.beforeAll(async ({request}) => {
  console.log(process.env.TURSO_DB_CONNECTION_URL!);
});

test.describe("User goes to the HomePage", () => {
  test("User should be able to visit homepage.", async ({ page }) => {
    await expect(page).toHaveTitle(/Canticum Bibliothecam/);
  });

  test("User should be able to search for authors in homepage.", async () => {});

  test("User Should be able to search for songs in homepage.", async () => {});
});
