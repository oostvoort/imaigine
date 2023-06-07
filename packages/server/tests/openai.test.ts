/* globals describe, expect, it */
import {
  GenerateNonPlayerCharacterProps,
  GeneratePlayerCharacterProps,
  GeneratePlayerCharacterResponse,
} from '../../types'

import { generateNonPlayerCharacter, generatePlayerCharacter } from '../lib/openai/generate/generateCharacter'
import { generateStory } from '../lib/openai/generate/generateStory'
import { extractElements, generateDescriptiveLocation, generateLocation } from '../lib/openai/generate/generateLocation'
import { generatePath } from '../lib/openai/generate/generatePath'

import {
  characterStats,
  characterStory,
  generateItemProps,
  generateStoryProps,
  generateTravelProps,
  location1,
  location2,
  physicalFeatures,
  player,
  story,
} from '../../types/mock'
import { generateTravel } from '../lib/openai/generate/generateTravel'
import { generateItem } from '../lib/openai/generate/generateItem'


// Super basic smokechecks
describe('Test OpenAI', function () {
  this.timeout(6000 * 2000);

  it('should generate a Story', async function () {

    let story = await generateStory(generateStoryProps)
    console.log('story: ', story)

  })

  it('should generate a Location', async function () {

    let location1 = await generateLocation({ story, player })
    console.log('location: ', JSON.stringify(location1, null, '\t'))

  })


  it('should generate a PlayerCharacter', async function () {


    const input: GeneratePlayerCharacterProps = {
      characterStory,
      story,
      location: location1,
      characterStats,
      physicalFeatures,
    }
    let player: GeneratePlayerCharacterResponse = await generatePlayerCharacter(input)
    console.log('player: ', player)

  })

  it('should generate an NPC', async function () {


    const input: GenerateNonPlayerCharacterProps = {
      story,
      location: location1,
      characterStats,
    }

    let npc = await generateNonPlayerCharacter(input)

    console.log('npc: ', npc)

  })

  it('should generate a Path', async function () {

    let path = await generatePath(
      {
        story, toLocation: location1, fromLocation: location2,
      },
    )

    console.log('path: ', path)

  })

  it('should generate a Travel for a player', async function () {

    let travel = await generateTravel(
      generateTravelProps,
    )

    console.log('path: ', travel)

  })

  it('should generate an item', async function () {

    let item = await generateItem(
      generateItemProps,
    )

    console.log('item: ', item)

  })

  it('should generate descriptive location', async function() {
    const storyName = "Amadea"
    const storySummary = "A beautiful world filled with vibrant and luscious plantation. Different indigenous species live in this amazing planet such as orcs, elves, nymphs, and fairies. Innovation was stuck in the middle ages but magic abounded everywhere."
    const result = await generateDescriptiveLocation({story: { name: storyName, summary: storySummary}})
    const extracted = await extractElements(result)
    const expand = await generateDescriptiveLocation({ story: { name: storyName, summary: storySummary }, baseSummary: extracted.locations[1] })
  })
})
