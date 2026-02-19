import { test, expect } from "./fixtures/auth";

test.describe("App autenticado (MSW)", () => {
  test("deve exibir o nome do usuário após autenticação", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByText("Test User").first()).toBeVisible();
  });

  test("deve navegar para a página de artistas", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/artists");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("deve buscar artistas e exibir resultados", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/artists");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByRole("textbox");
    await searchInput.fill("Rock");
    await searchInput.press("Enter");

    await expect(page.getByText("Rock 1").first()).toBeVisible({ timeout: 15000 });
  });

  test("deve navegar para a página de biblioteca", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/library");
    await page.waitForLoadState("networkidle");

    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("deve ser responsivo em viewport mobile", async ({
    authenticatedPage: page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/artists");
    await page.waitForLoadState("networkidle");

    const body = page.locator("body");
    await expect(body).toBeAttached();
  });

  test("não deve ter erros críticos de console", async ({
    authenticatedPage: page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/artists");
    await page.waitForLoadState("networkidle");

    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("[MSW]") &&
        !e.includes("favicon") &&
        !e.includes("mockServiceWorker") &&
        !e.includes("Failed to load resource") &&
        !e.includes("net::ERR"),
    );
    expect(criticalErrors.length).toBe(0);
  });
});
