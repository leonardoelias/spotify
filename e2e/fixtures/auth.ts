import { test as base, type Page } from "@playwright/test";

export async function injectAuthTokens(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem("spotify_access_token", "mock-access-token");
    localStorage.setItem("spotify_refresh_token", "mock-refresh-token");
    localStorage.setItem(
      "spotify_token_expiry",
      String(Date.now() + 3600 * 1000),
    );
  });
}

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("/");
    await injectAuthTokens(page);
    await page.reload();
    await page.waitForLoadState("networkidle");
    await use(page);
  },
});

export { expect } from "@playwright/test";
