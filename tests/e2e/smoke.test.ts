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

  const page = await browser.newPage();
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
