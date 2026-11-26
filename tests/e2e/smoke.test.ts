import test from 'node:test';
import assert from 'node:assert/strict';
import { launchBrowser, startStaticServer } from './helpers';

test('built site, planner and privacy page work in a real browser', async (t) => {
  const { server, origin } = await startStaticServer();
  const browser = await launchBrowser();
  t.after(async () => {
    await browser.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  t.after(async () => context.close());
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  const external: string[] = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('request', (req) => { if (!req.url().startsWith(origin)) external.push(req.url()); });

  await page.goto(`${origin}/synodos/`, { waitUntil: 'networkidle' });
  assert.match(await page.title(), /Synodos/);
  assert.ok(await page.getByText('See the world.').isVisible());
  assert.ok((await page.locator('a[href="/synodos/privacy/"]').count()) > 0);
  assert.ok(await page.getByText('The waitlist is not open yet').isVisible());
  const homeHtml = await page.content();
  assert.equal(homeHtml.includes('@gmail.com'), false);
  assert.equal(consoleErrors.length, 0, consoleErrors.join(' | '));
  assert.equal(external.some((url) => url.includes('fonts.googleapis') || url.includes('fonts.gstatic')), false);
  assert.equal(external.some((url) => url.includes('formsubmit')), false);

  await page.goto(`${origin}/synodos/planner/`, { waitUntil: 'networkidle' });

  // Invalid input must produce a visible message, not a fabricated plan.
  await page.locator('input[type="date"]').fill('');
  await page.getByRole('button', { name: /Build my plan/ }).click();
  assert.ok(await page.getByText('Enter a real start date').isVisible());
  assert.equal(await page.locator('.plan-day').count(), 0);

  await page.locator('select').nth(1).evaluate((el) => {
    const select = el as HTMLSelectElement;
    select.add(new Option('9 people', '9'));
    select.value = '9';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('input[type="date"]').fill('2026-11-27');
  await page.getByRole('button', { name: /Build my plan/ }).click();
  assert.ok(await page.getByText('Choose between 1 and 4 travellers.').isVisible());

  await page.locator('select').nth(1).selectOption('2');
  await page.getByRole('button', { name: /Build my plan/ }).click();
  await page.locator('.plan-day').first().waitFor();
  assert.equal(await page.locator('.plan-day').count(), 3);

  const titles = await page.locator('.plan-slot strong').allTextContents();
  assert.equal(new Set(titles).size, titles.length, 'planner repeated a stop');
  const price = await page.locator('.plan-tags em').first().textContent();
  assert.ok(price?.includes('USD'), `unexpected price label: ${price}`);
  assert.ok(await page.locator('.feasibility').isVisible());

  await page.locator('.plan-rebuild').first().click();
  assert.equal(await page.locator('.plan-day').count(), 3);
  const rebuilt = await page.locator('.plan-slot strong').allTextContents();
  assert.equal(new Set(rebuilt).size, rebuilt.length, 'rebuild repeated a stop');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download .md/ }).click(),
  ]);
  assert.match(download.suggestedFilename(), /^synodos-[a-z]+-plan\.md$/);

  const heading = await page.locator('.plan-head h2').textContent();
  const cityNameFromPlan = (heading ?? '').split(',')[0];
  await page.getByRole('button', { name: /^Copy/ }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(copied.includes(cityNameFromPlan), `clipboard content: ${copied.slice(0, 80)}`);

  await page.getByRole('button', { name: /Save plan/ }).click();
  assert.ok(await page.getByRole('button', { name: /Saved/ }).isVisible());
  await page.reload({ waitUntil: 'networkidle' });
  assert.ok(await page.getByRole('button', { name: /Saved/ }).isVisible(), 'plan was not restored');
  assert.equal(await page.locator('.plan-day').count(), 3);

  await page.goto(`${origin}/synodos/privacy/`, { waitUntil: 'networkidle' });
  assert.match(await page.title(), /Privacy/);
  assert.ok(await page.getByText('What we do not do').isVisible());
  assert.equal(consoleErrors.length, 0, consoleErrors.join(' | '));
});
