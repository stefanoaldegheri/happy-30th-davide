// @ts-check
const { test, expect } = require('@playwright/test');

test('All pages load without errors', async ({ page }) => {
  console.log('Testing page loads...');
  
  // Test welcome page
  console.log('Navigating to welcome page...');
  await page.goto('/');
  console.log('Checking page title...');
  await expect(page).toHaveTitle(/Interactive Gift Application/);
  console.log('Checking welcome message visibility...');
  await expect(page.locator('text=A Special Gift Awaits')).toBeVisible();
  console.log('Welcome page loaded successfully');

  // Test chess puzzle page
  console.log('Navigating to chess puzzle page...');
  await page.goto('/chess');
  console.log('Checking chess challenge text visibility...');
  await expect(page.locator('h1:has-text("Chess Challenge")')).toBeVisible();
  console.log('Chess puzzle page loaded successfully');

  // Test OCR module page
  console.log('Navigating to OCR module page...');
  await page.goto('/ocr');
  console.log('Checking OCR challenge text visibility...');
  await expect(page.locator('text=Text Recognition Challenge')).toBeVisible();
  console.log('OCR module page loaded successfully');

  // Test reveal module page
  console.log('Navigating to reveal module page...');
  await page.goto('/reveal');
  console.log('Checking reveal secret text visibility...');
  await expect(page.locator('text=Reveal the Secret')).toBeVisible();
  console.log('Reveal module page loaded successfully');

  // Test final link page
  console.log('Navigating to final link page...');
  await page.goto('/final');
  console.log('Checking congratulations text visibility...');
  await expect(page.locator('h1:has-text("Congratulations!")')).toBeVisible();
  console.log('Final link page loaded successfully');
  
  console.log('All pages loaded successfully');
});