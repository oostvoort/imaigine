/* globals describe, expect, it */
import { GeneratePlayerCharacterProps } from '../../types'

import { generatePlayerCharacter } from '../lib/openai/generate/generateCharacter'
import { generateStory } from '../lib/openai/generate/generateStory'
import { generateLocation } from '../lib/openai/generate/generateLocation'
import { generatePath } from '../lib/openai/generate/generatePath'

import {
  characterStats,
  characterStory,
  generateStoryProps,
  generateTravelProps,
  location1,
  location2,
  physicalFeatures,
  story,
} from './mock'
import { generateTravel } from '../lib/openai/generate/generateTravel'


// Super basic smokechecks
describe('Test OpenAI', function () {

  it('should generate a Story', async function () {

    let story = await generateStory(generateStoryProps)
    console.log('story: ', story)

  })

  it('should generate a Location', async function () {

    let location1 = await generateLocation({ story })
    console.log('location: ', location1)

  })

  it('should generate a PlayerCharacter', async function () {


    const input: GeneratePlayerCharacterProps = {
      characterStory,
      story,
      location: location1,
      characterStats,
      physicalFeatures,
    }
    let player = await generatePlayerCharacter(input)
    console.log('player: ', player)

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

})
