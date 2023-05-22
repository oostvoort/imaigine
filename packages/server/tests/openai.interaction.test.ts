/* globals describe, expect, it */
import { generateInteractionProps } from './mock'
import { generateInteraction } from '../lib/openai/generate/generateInteraction'

import * as dotenv from 'dotenv'
import pinataSDK from '@pinata/sdk'
import { loadJson, storeJson } from '../lib/ipfs'

dotenv.config()

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
})

async function loadLogs(hash: string): Promise<string[]> {
  let result = []
  if (hash.length > 0) {
    result = await (await fetch(
      `${process.env.IPFS_URL_PREFIX}/${hash}`,
      { method: 'GET' },
    )).json()
  }
  return result
}

// Super basic smokechecks
describe('Test OpenAI', function () {


  it('should handle the ipfs log storage', async function () {

    const props = generateInteractionProps

    let logs: string[] = await loadJson(props.logHash, [])
    logs.push('ha')

    const hash = await storeJson(logs)
    console.log(hash)

    logs = await loadLogs(hash)
    console.log('loadedLogs', logs)
  })


  it('should generate an interaction between player and npc', async function () {

    // const generateInteractionProps: GenerateInteractionParams = {
    //   activeEntity: player,
    //   otherEntities: [ npc ],
    //   log: [
    //     `${player.name} begins dancing uncontrollably`,
    //     `${player.name} sings a funny song about ${npc.name}`,
    //     `${player.name}: offer to buy a hammer`,
    //     `${npc.name}: I'm sorry, I can't part with it for less than the price I've offered.`,
    //     `${player.name}: offered to set up a payment plan to purchase a hammer from Yellena.`,
    //     `${npc.name}: That's very kind of you. But I'm not sure how we can make a payment plan work. Perhaps I could help you with some tasks in exchange for the hammer.`,
    //     `${player.name} has asked Yellena to explain what tasks would need to be done in exchange for the hammer.`,
    //     `${npc.name}: Well, I need help cleaning up the forge. for your help, I'll give you a sword for free.`,
    //   ],
    //   action: 'Help Yellena clean up the forge',
    // }

    //

    const interaction = await generateInteraction(
      generateInteractionProps,
    )

    console.log('interaction: ', interaction)

  })

})
