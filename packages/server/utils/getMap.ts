import puppeteer, { Page } from 'puppeteer';
export async function launchAndNavigateMap(seed: number): Promise<Page> {
  const browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();
  await page.goto(`http://localhost:3001/map/index.html?burg=75&scale=12&maplink=http://localhost:3000/mapdata?seed=${seed}`);
  await delay(2000);

  return page
}

async function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
