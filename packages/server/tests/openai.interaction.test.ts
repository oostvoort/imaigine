/* globals describe, expect, it */
import { generateInteractionProps, item_warhammer, location1, npc, player, story } from '../../types/mock'
import { generateInteraction } from '../lib/openai/generate/generateInteraction'

import * as dotenv from 'dotenv'
import { loadJson, remove, storeJson } from '../lib/ipfs'
import { GenerateInteractionProps, GenerateInteractionResponse } from '../../types'

dotenv.config()

// Super basic smokechecks
describe('Test OpenAI', function () {


  it('should handle the ipfs log storage', async function () {

    const props = generateInteractionProps

    let logs: string[] = await loadJson(props.logHash, [])
    logs.push('ha')

    const hash = await storeJson(logs)
    console.log(hash)

    logs = await loadJson(hash, [])
    console.log('loadedLogs', logs)
  })


  it('should generate initial actions between player and item', async function () {
    const props: GenerateInteractionProps = {
      storySummary: story.summary,
      location: location1,
      activeEntity: player,
      otherEntities: [ item_warhammer ],
      logHash: '',
      action: '',
      mode: 'interactable',
    }

    const interaction = await generateInteraction(
      props,
    )

    console.log('interaction: ', JSON.stringify(interaction, null, '\t'))
    await remove(props.logHash)
    await remove(interaction.logHash)


  })

  it('should generate continueing actions between player and item', async function () {

    const props: GenerateInteractionProps = {
      storySummary: story.summary,
      location: location1,
      activeEntity: player,
      otherEntities: [ item_warhammer ],
      logHash: '',
      action: '',
      mode: 'interactable',
    }

    let logs: string[] = await loadJson(props.logHash, [])

    logs = logs.concat([ `${player.name} begins dancing uncontrollably`,
      `${player.name} inspects the blade very closely`,
      `${npc.name} looks flawless, except for a mysterious inscription`,
    ])

    props.logHash = await storeJson(logs)


    const interaction = await generateInteraction(
      props,
    )
    console.log('interaction: ', JSON.stringify(interaction, null, '\t'))

    await remove(props.logHash)
    await remove(interaction.logHash)


  })


  it('should generate initial actions between player and npc', async function () {
    const props: GenerateInteractionProps = {
      storySummary: story.summary,
      location: location1,
      activeEntity: player,
      otherEntities: [ npc ],
      logHash: '',
      action: '',
      mode: 'interactable',
    }

    const interaction = await generateInteraction(
      props,
    )

    console.log('interaction: ', JSON.stringify(interaction, null, '\t'))
    await remove(props.logHash)
    await remove(interaction.logHash)


  })


  it('should generate initial actions between player and location', async function () {
    const props: GenerateInteractionProps = {
      storySummary: story.summary,
      location: location1,
      activeEntity: player,
      otherEntities: [],
      logHash: '',
      action: '',
      mode: 'location',
    }

    const interaction = await generateInteraction(
      props,
    )

    console.log('interaction: ', JSON.stringify(interaction, null, '\t'))
    await remove(props.logHash)
    await remove(interaction.logHash)


  })

  it('should generate a complex interaction between player and npc', async function () {
    const props: GenerateInteractionProps = {
      activeEntity: player,
      otherEntities: [ npc ],
      location: location1,
      storySummary: story.summary,
      logHash: '',
      action: 'buy a hammer',
      mode: 'interactable',
    }
    let logs: string[] = await loadJson(props.logHash, [])

    logs = logs.concat([ `${player.name} begins dancing uncontrollably`,
      `${player.name} sings a funny song about ${npc.name}`,
      `${player.name}: offer to buy a hammer`,
      `${npc.name}: I'm sorry, I can't part with it for less than the price I've offered.`,
      `${player.name}: offered to set up a payment plan to purchase a hammer from Yellena.`,
      `${npc.name}: That's very kind of you. But I'm not sure how we can make a payment plan work. Perhaps I could help you with some tasks in exchange for the hammer.`,
      `${player.name} has asked Yellena to explain what tasks would need to be done in exchange for the hammer.`,
      `${npc.name}: Well, I need help cleaning up the forge. for your help, I'll give you a sword for free.`,
    ])

    props.logHash = await storeJson(logs)

    const interaction: GenerateInteractionResponse = await generateInteraction(
      generateInteractionProps,
    )

    console.log('interaction: ', JSON.stringify(interaction, null, '\t'))
    await remove(props.logHash)
    await remove(interaction.logHash)


  })

})
