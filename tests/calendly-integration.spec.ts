import { test, expect, Page } from '@playwright/test';

test.describe('Calendly Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Synura/i);

    // Take screenshot of homepage
    await page.screenshot({
      path: 'test-results/homepage.png',
      fullPage: true
    });

    console.log('✓ Homepage loaded and screenshot captured');
  });

  test('Main hero CTA button triggers Calendly popup', async ({ page }) => {
    // Look for the main CTA button in the hero section
    const ctaButton = page.locator('a[href*="calendly"], button').filter({ hasText: /consultation|schedule|book/i }).first();

    // Take screenshot before clicking
    await page.screenshot({
      path: 'test-results/before-cta-click.png',
      fullPage: true
    });

    // Click the CTA button
    await ctaButton.click();

    // Wait for Calendly popup/iframe to appear
    await page.waitForTimeout(2000); // Give time for Calendly to load

    // Check if Calendly iframe or popup is present
    const calendlyFrame = page.frameLocator('iframe[src*="calendly"]');
    const hasCalendlyFrame = await page.locator('iframe[src*="calendly"]').count() > 0;

    // Take screenshot after clicking
    await page.screenshot({
      path: 'test-results/after-cta-click.png',
      fullPage: true
    });

    console.log('✓ Main CTA button clicked and screenshot captured');
    console.log(`  Calendly frame present: ${hasCalendlyFrame}`);

    expect(hasCalendlyFrame).toBe(true);
  });

  test('Header "Free Consultation" button triggers Calendly popup', async ({ page }) => {
    // Look for the header consultation button
    const headerButton = page.locator('header a[href*="calendly"], header button').filter({ hasText: /consultation|schedule/i }).first();

    // Take screenshot before clicking
    await page.screenshot({
      path: 'test-results/before-header-button-click.png',
      fullPage: true
    });

    // Click the header button
    await headerButton.click();

    // Wait for Calendly popup to appear
    await page.waitForTimeout(2000);

    // Check for Calendly iframe
    const hasCalendlyFrame = await page.locator('iframe[src*="calendly"]').count() > 0;

    // Take screenshot after clicking
    await page.screenshot({
      path: 'test-results/after-header-button-click.png',
      fullPage: true
    });

    console.log('✓ Header button clicked and screenshot captured');
    console.log(`  Calendly frame present: ${hasCalendlyFrame}`);

    expect(hasCalendlyFrame).toBe(true);
  });

  test('Verify no redirects to /contact page', async ({ page }) => {
    // Monitor navigation
    let redirectedToContact = false;

    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame() && frame.url().includes('/contact')) {
        redirectedToContact = true;
      }
    });

    // Click main CTA
    const ctaButton = page.locator('a[href*="calendly"], button').filter({ hasText: /consultation|schedule|book/i }).first();
    await ctaButton.click();

    await page.waitForTimeout(2000);

    // Verify we didn't redirect to /contact
    expect(redirectedToContact).toBe(false);
    expect(page.url()).not.toContain('/contact');

    console.log('✓ Verified no redirect to /contact page');
  });

  test('Services page consultation buttons trigger Calendly', async ({ page }) => {
    // Navigate to services page
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Take screenshot of services page
    await page.screenshot({
      path: 'test-results/services-page.png',
      fullPage: true
    });

    console.log('✓ Services page loaded and screenshot captured');

    // Find consultation buttons on services page
    const serviceButtons = page.locator('a[href*="calendly"], button').filter({ hasText: /consultation|schedule|book/i });
    const buttonCount = await serviceButtons.count();

    console.log(`  Found ${buttonCount} consultation buttons on services page`);

    if (buttonCount > 0) {
      // Click the first button
      await serviceButtons.first().click();
      await page.waitForTimeout(2000);

      // Check for Calendly iframe
      const hasCalendlyFrame = await page.locator('iframe[src*="calendly"]').count() > 0;

      // Take screenshot
      await page.screenshot({
        path: 'test-results/services-calendly-popup.png',
        fullPage: true
      });

      console.log(`  Calendly frame present after clicking: ${hasCalendlyFrame}`);

      expect(hasCalendlyFrame).toBe(true);
    }
  });

  test('Calendly widget initialization', async ({ page }) => {
    // Check if Calendly script is loaded
    const calendlyScript = await page.locator('script[src*="calendly"]').count();

    console.log(`✓ Calendly script tags found: ${calendlyScript}`);

    // Check for Calendly badge widget
    await page.waitForTimeout(2000); // Give time for Calendly badge to load

    const calendlyBadge = await page.locator('.calendly-badge-widget, [class*="calendly"]').count();

    console.log(`  Calendly widgets found: ${calendlyBadge}`);

    // Take screenshot
    await page.screenshot({
      path: 'test-results/calendly-widget-check.png',
      fullPage: true
    });
  });

  test('All consultation CTAs are properly configured', async ({ page }) => {
    // Find all links and buttons that might be consultation CTAs
    const allCTAs = page.locator('a, button').filter({ hasText: /consultation|schedule|book.*call/i });
    const ctaCount = await allCTAs.count();

    console.log(`✓ Found ${ctaCount} potential consultation CTAs`);

    // Check each CTA
    for (let i = 0; i < ctaCount; i++) {
      const cta = allCTAs.nth(i);
      const text = await cta.textContent();
      const href = await cta.getAttribute('href');
      const onclick = await cta.getAttribute('onclick');

      console.log(`  CTA ${i + 1}: "${text?.trim()}"`);
      console.log(`    href: ${href || 'none'}`);
      console.log(`    onclick: ${onclick || 'none'}`);

      // Verify it's not linking to /contact
      if (href) {
        expect(href).not.toBe('/contact');
      }
    }
  });
});
