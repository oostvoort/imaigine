import { executePrompt } from '../executePrompt'
import {
  CharacterStats,
  ExtractElementsProps, ExtractElementsResponse, GenerateDescriptiveLocationProps,
  GenerateLocationProps,
  GenerateLocationResponse,
} from 'types'
import { getRandomValue, PROMPT_OUTPUT_JSON } from '../utils'

export interface AILocation {
  name: string,
  summary: string,
  characters: Array<{
    name: string
    summary: string
    stats: CharacterStats,
    initialMessage: string
    closingMessage: string,
    imgHash: string
  }>,
  items: Array<string>,
  imgHash: string
}


const wealthLevels = [ 'Poor', 'Lower Middle Class', 'Middle Class', 'Upper Middle Class', 'Wealthy' ]
const populationSizes = [ 'Small', 'Medium', 'Large', 'Very Large', 'Metropolis' ]
const safetyLevels = [ 'Unsafe', 'Moderately Safe', 'Safe', 'Very Safe', 'Highly Secure' ]
const biomes = [ 'Tropical Rainforest', 'Temperate Forest', 'Taiga', 'Desert', 'Savanna', 'Grassland', 'Tundra', 'Mediterranean', 'Chaparral', 'Wetland', 'Coral Reef', 'Mountain', 'Prairie', 'Arctic', 'Mangrove', 'Steppe', 'Boreal Forest', 'Shrubland', 'Swamp', 'Estuary', 'Salt Marsh', 'Cave', 'Volcano', 'Oasis', 'Canyon', 'Plateau' ]

export async function generateLocation({ story }: GenerateLocationProps): Promise<GenerateLocationResponse> {
  const prompt = `
    Given the following world description:
    "${story.summary}"
    Generate a 3 paragraph description of a location in ${story.name}.
    Describe it's history within the world.

    Give it a name.

    And must have the following features:
    It is in a ${getRandomValue(biomes)} biome.
    It's population size is ${getRandomValue(populationSizes)}
    It's safety level is ${getRandomValue(safetyLevels)}
    It's wealth level is ${getRandomValue(wealthLevels)}

    Summarize the location visually

    ${PROMPT_OUTPUT_JSON}

    {
        "name": "the name of the location",
        "summary": "the generated description",
        "visualSummary": "a string of comma separated keywords describing the location"
    }
    `

  const output = await executePrompt(prompt)
  const json: GenerateLocationResponse = JSON.parse(output)
  return json
}

export async function generateDescriptiveLocation({ story, baseSummary }: GenerateDescriptiveLocationProps ): Promise<GenerateLocationResponse> {
  const prompt = `
    Given the following world description:
    ${story.summary}
    Generate a 3 paragraph description of a location in ${story.name}.
    Describe it's history within the world.

    ${baseSummary ? `The name of the location is ${baseSummary.name} with a description of "${baseSummary.summary}"` : 'Give it a name'}

    And must have the following features:
    It is in a ${getRandomValue(biomes)} biome.
    It's population size is ${getRandomValue(populationSizes)}
    It's safety level is ${getRandomValue(safetyLevels)}
    It's wealth level is ${getRandomValue(wealthLevels)}

   Summarize the location visually and include two other named nearby locations and two characters living in the location. Also include in the summary,
   mystical items that could be interacted with and name them.

    ${PROMPT_OUTPUT_JSON}

    {
        "name": "the name of the location",
        "summary": "the generated description describing the location, nearby locations, named characters living in the location, and named mystical items",
        "visualSummary": "a string of comma separated keywords describing the current location alone"
    }
    `
  const output = await executePrompt(prompt)
  const json: GenerateLocationResponse = JSON.parse(output)
  return json
}

export async function extractElements({ summary }: ExtractElementsProps): Promise<ExtractElementsResponse> {
  const prompt = `
      From this summary:
      "${summary}",
      extract the locations (making sure that the number of locations extracted is more than two), characters and named items.

      ${PROMPT_OUTPUT_JSON}

      {
        "locations": [{
          "name": "the name of the location",
          "summary": "make a paragraph-long description",
          "visualSummary": "a string of comma separated keywords"
        }],
        "items": [{
          "name": "the name of the item",
          "summary": "make a description detailing the item's history within the world and its features",
          "visualSummary": "a string of comma separated keywords"
        }],
        "characters": [{
          "name": "the name of the character",
          "summary": "make a paragraph long description including the visual aspects of the character",
          "visualSummary": "a string of comma separated keywords"
        }]
      }
`
  const output = await executePrompt(prompt)
  const json: ExtractElementsResponse = JSON.parse(output)
  return json
}
