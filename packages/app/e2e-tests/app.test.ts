/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

/**
 * All pages in this section are accessible without the need to login first.
 * A default guest user is used behind the scenes.
 */
test.describe('Login not needed to access non-protected pages', () => {
  test('homepage is available', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Documentation library')).toBeVisible();
  });

  test('techdocs are available', async ({ page }) => {
    await page.goto('/docs');
    await expect(
      page.getByText('Documentation available in BCDevExchange'),
    ).toBeVisible();
    await page.getByRole('link', { name: 'Mobile development guide' }).click();
    await expect(
      page.getByRole('heading', { name: 'Mobile app development' }),
    ).toBeVisible({ timeout: 20_000 }); // give this extra time to load, it seems slow sometimes and fails
  });

  test('search is available', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox').fill('Vault');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Search')).toBeVisible();
  });

  test('api-docs are available', async ({ page }) => {
    await page.goto('/api-docs');
    await expect(
      page.getByRole('heading', { name: 'All apis (0)' }),
    ).toBeVisible();
  });

  test('tech-radar is available', async ({ page }) => {
    await page.goto('/tech-radar');
    await expect(page.getByText('Tech Radar')).toBeVisible();
  });

  test('catalog is available', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByText('BCDevExchange Catalog')).toBeVisible();
  });

  test('catalog is available when it has params', async ({ page }) => {
    await page.goto(
      '/catalog?filters%5Bkind%5D=component&filters%5Buser%5D=owned&limit=20',
    );
    await expect(page.getByText('BCDevExchange Catalog')).toBeVisible();
  });

  test('catalog entity is available', async ({ page }) => {
    await page.goto('/catalog/default/component/mobile-developer-guide');
    await expect(page.getByText('Mobile development guide')).toBeVisible();
  });

  test('catalog-graph is available', async ({ page }) => {
    await page.goto('/catalog-graph');
    await expect(page.getByText('Catalog Graph')).toBeVisible();
  });
});

/**
 * All pages in this section are behind a login screen
 */
test.describe('Login needed to access protected pages', () => {
  test('login needed for wizards', async ({ page }) => {
    await page.goto('/create');
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('login needed for settings', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('login needed for catalog-import', async ({ page }) => {
    await page.goto('/catalog-import');
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });
});

/**
 * Redirected pages. None of these are behind the login screen
 */
test.describe('redirects are available', () => {
  test('redirected pages are available', async ({ page }) => {
    await page.goto('/Design-System/About-the-Design-System');
    await page.waitForURL('**/docs/**');
    expect(page.url()).toContain('/docs/default/component/'); // redirect to techdocs

    await page.goto('/Data-and-APIs/API-Guidelines');
    await page.waitForURL('**/docs/**');
    expect(page.url()).toContain('/docs/default/component/'); // redirect to techdocs

    await page.goto('/API-Guidelines');
    await page.waitForURL('**/docs/**');
    expect(page.url()).toContain('/docs/default/component/'); // redirect to techdocs
  });
});

test.describe('techdoc-expandable-toc plugin', () => {
  test('expand/collapse ToC and navigate to Contact Info', async ({
    page,
    browserName,
  }) => {
    // Skip this test when running webkit on localhost because techdocs
    // don't render correctly in webkit on localhost.
    test.skip(
      browserName === 'webkit' && !process.env.PLAYWRIGHT_URL,
      'Skipping webkit test on localhost',
    );

    // Test expanding and collapsing the ToC in the Mobile Developer Guide
    // and navigating to the Contact Info section.
    await page.goto(
      '/docs/default/component/mobile-developer-guide/getting_started',
    );

    const contactLinkNotPresent = page.getByRole('link', {
      name: /contact info/i,
    });
    await expect(contactLinkNotPresent).toHaveCount(0);

    const expandButton = page.getByRole('button', { name: /expand-toc/i });
    await expect(expandButton).toBeVisible();
    await expandButton.click();

    const contactInfoLink = page
      .getByRole('link', { name: /contact info/i })
      .first();
    await expect(contactInfoLink).toBeVisible();

    await contactInfoLink.click();

    const contactInfoHeading = page.getByRole('heading', {
      name: /contact info/i,
    });
    await expect(contactInfoHeading).toBeVisible();

    const collapseButton = page.getByRole('button', { name: /collapse-toc/i });
    await expect(collapseButton).toBeVisible();
    await collapseButton.click();

    await expect(contactInfoLink).not.toBeVisible();
  });
});
