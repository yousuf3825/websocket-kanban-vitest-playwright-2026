import { test, expect } from "@playwright/test";

test("User can add a task and see it on the board", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.getByText("Kanban Board")).toBeVisible();
  await page.fill('input[placeholder="Title"]', 'Test Task');
  await page.fill('input[placeholder="Description"]', 'Test Description');
  await page.selectOption('select', 'High');
  await page.click('button[type="submit"]');
  await expect(page.getByText("Test Task")).toBeVisible();
});
