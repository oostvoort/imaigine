/* globals describe, expect, it */
import { expect } from 'chai'

import { generatePlayerImage } from '../lib/leonardo'

// Super basic smokechecks
describe('Test Leonardo', function () {

  it('should return an imagehash', async function () {
    const hash = await generatePlayerImage('A lovely female blacksmith')
    console.log('Hash: ', hash)
    expect(hash.length === 46, 'No hash found')
  })

  
})
