import puppeteer from 'puppeteer';
import fs from "fs-extra"
// import {loadJson, storeFile, storeJson} from './ipfs'

export async function generateMap(seed: number) : Promise<string>{

    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Set screen size
    await page.setViewport({width: 768, height: 768});

    await page.goto(`http://localhost:3000/map/?seed=${seed}&options=default`);

    // Setting version in locastorage so the update/version popup doesnt show anymore
    await page.evaluate(() => {
        localStorage.setItem('version', '1.89.26');
    });

    await page.waitForTimeout(2000)

    await page.keyboard.press("Tab")
    // await page.keyboard.press("e")
    await page.keyboard.press("i")

    const data = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return getMapData()
    });

    const filename = `${seed}.map`

    fs.writeFileSync(filename, data)

    // const hash = await storeFile(filename)
    // const url = `${process.env.IPFS_URL_PREFIX}${hash}`
    console.log(`saved to: ${filename}`)
    await browser.close();

    return data
}
