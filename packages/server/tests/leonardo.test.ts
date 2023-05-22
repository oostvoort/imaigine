/* globals describe, expect, it */
import { expect } from 'chai'

import { generateLocationImage, generatePlayerImage } from '../lib/leonardo'

// Super basic smokechecks
describe('Test Leonardo', function () {

  it('should perform generatePlayerImage', async function () {
    const prompt = 'A lovely female blacksmith'
    
    const hash = await generatePlayerImage(prompt)
    console.log('Link: ', `${process.env.IPFS_URL_PREFIX}${hash}`)
    expect(hash.length === 46, 'No hash found')
  })

  it('should perform generateLocationImage', async function () {
    const PROMPT = 'coral reef, bustling, goblins, elves, battles, resources, safe, wealth, smog, beacon, fortitude'

    const hash = await generateLocationImage(PROMPT)
    console.log('Link: ', `${process.env.IPFS_URL_PREFIX}${hash}`)
    expect(hash.length === 46, 'No hash found')
  })


})
