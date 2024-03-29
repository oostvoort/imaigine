import puppeteer, { Page } from 'puppeteer'
import { RouteObject } from 'types'
import { getPlayerRevealedCells } from '../lib/contract'
import * as dotenv from 'dotenv'
import { HOST_NAME, MAP_SEED } from '../global/config'


dotenv.config()
export async function launchAndNavigateMap(seed: number): Promise<Page> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page: Page = await browser.newPage();
  await page.goto(`${HOST_NAME}/map/index.html?maplink=${HOST_NAME}/mapdata?seed=${seed}`);
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

    for (const path of paths) {
      const pathInfo = window.getCellInfo(path)
      routeData.push(pathInfo)
    }

    // Call the function on the page to get "to reveal cell"
    const toRevealAtDestination = window.getToRevealCells(to, exploredCells)

    return {
      routeData,
      toRevealAtDestination
    }
  }, exploredCells, from, to)
}

export async function getLocations(mapSeed: number) {
  const page = await launchAndNavigateMap(mapSeed)
  // Access the function on the page
  return await page.evaluate(() => {
    // Call the function on the page to get all burgs
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return window.getAllBurg()
  })
}

export async function getToRevealCells(from: number, exploredCells: number[]) {
  const page = await launchAndNavigateMap(Number(MAP_SEED))
  // Access the function on the page
  return await page.evaluate((from, exploredCells) => {
    // Call the function on the page to get all burgs
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return window.getToRevealCells(from, exploredCells)
  }, from, exploredCells)
}
