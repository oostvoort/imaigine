import puppeteer, { Page } from 'puppeteer'
import { RouteObject } from 'types'
import { getPlayerRevealedCells } from '../lib/contract'

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

export async function getRoute(mapSeed: number, playerEntityId: string, from: number, to: number) {
  const exploredCells = await getPlayerRevealedCells(playerEntityId)
  const page = await launchAndNavigateMap(mapSeed)
  // Access the function on the page
  return await page.evaluate((exploredCells: number[], from: number, to: number) => {
    const routeData: RouteObject[] = []

    // Call the function on the page to find the nearest path
    const paths = window.findNearestPath(from, to)

    for (const path of paths[0]) {
      const pathInfo = window.getCellInfo(path)
      routeData.push(pathInfo)
    }

    // Call the function on the page to get "to reveal cell"
    const toRevealAtDestination = window.getToRevealCells(from, exploredCells)

    return {
      routeData,
      toRevealAtDestination
    }
  }, exploredCells, from, to)
}
