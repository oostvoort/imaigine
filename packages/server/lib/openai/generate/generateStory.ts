import { executePrompt } from '../executePrompt'
import { AILocation } from './generateLocation'
import { GenerateLocationResponse, GenerateStoryProps, GenerateStoryResponse, JsonResponse } from 'types'
import { AIPath } from './generatePath'

export interface AIStory {
  theme: string,
  races: Array<string>,
  currency: string
  summary: string,
  name: string,
  locations: Array<AILocation>,
  paths: Array<AIPath>
}

export async function generateStory({
  currency, races, theme, extraDescriptions,
}: GenerateStoryProps): Promise<GenerateStoryResponse> {
  const prompt = `
    Generate a 3 paragraph description of a ${theme} world.
    The world is populated by ${races.join(' and ')}
    The distinctive currency known as ${currency} is in circulation.

    ${
    extraDescriptions &&
    `Add these extra descriptions, flesh them out and integrate into the description:
    ${extraDescriptions.join(', ')}`
  }
    Summarize the story's world visually

    Respond only in JSON with the following format:

    {
        "name": "the name of the world",
        "summary": "the generated description",
        "visualSummary": "a list of keywords describing the world"

    }
    `

  const output = await executePrompt(prompt)
  const json: GenerateStoryResponse = JSON.parse(output)
  return json
}
