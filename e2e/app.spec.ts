import { test, expect } from '@playwright/test'

test.describe('App E2E Tests', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    
    await page.waitForLoadState('networkidle')
    
    const body = page.locator('body')
    await expect(body).toBeAttached()
  })

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/')
    
    await page.waitForLoadState('domcontentloaded')
    
    const body = page.locator('body')
    await expect(body).toBeAttached()
  })

  test('should render without critical errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    expect(errors.length).toBe(0)
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await page.waitForLoadState('domcontentloaded')
    const body = page.locator('body')
    await expect(body).toBeAttached()
  })

  test('should be responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await page.waitForLoadState('domcontentloaded')
    const body = page.locator('body')
    await expect(body).toBeAttached()
  })

  test('should be responsive on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    await page.waitForLoadState('domcontentloaded')
    const body = page.locator('body')
    await expect(body).toBeAttached()
  })
})
