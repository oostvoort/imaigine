import { StructuredOutputParser } from 'langchain/output_parsers'
import {
  locationInteractionSchema,
  locationSchema,
  nonPlayerCharacterSchema,
  playerCharacterSchema,
  storySchema,
} from './schemas'
import { OpenAI, PromptTemplate } from 'langchain'
import { PipelinePromptTemplate } from 'langchain/prompts'
import {
  locationInteractionPropmt,
  locationPrompt,
  nonPlayerCharacterPrompt,
  playerCharacterPrompt,
  storyPrompt,
} from './templates'
import {
  Based,
  Location,
  LocationInteractionProps,
  NonPlayerCharacterProps,
  NonPlayerCharacterResponse,
  PlayerCharacterProps,
} from './types'
import * as dotenv from 'dotenv'
import { GenerateLocationInteractionResponse, GenerateStoryProps, GenerateStoryResponse, Story } from 'types'

dotenv.config()

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 1,
  modelName: 'text-davinci-003',
  maxTokens: 1000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
})


export async function createFullPrompt(instructions: string, formatInstructions: string) {
  const fullPrompt = PromptTemplate.fromTemplate(`
       {instructions}\n
       {formatInstructions}
    `)

  return new PipelinePromptTemplate({
    pipelinePrompts: [
      {
        name: 'instructions',
        prompt: PromptTemplate.fromTemplate(instructions),
      },
    ],
    finalPrompt: fullPrompt,
    partialVariables: { formatInstructions: formatInstructions },
  })

}

export async function generateStory(storySettings: GenerateStoryProps): Promise<GenerateStoryResponse> {
  const parser = StructuredOutputParser.fromNamesAndDescriptions(storySchema)

  const formatInstruction = parser.getFormatInstructions()
  const composedPrompt = await createFullPrompt(storyPrompt, formatInstruction)

  const story = await composedPrompt.format(storySettings)
  const result = await model.call(story)

  const parseData = await parser.parse(result)

  return {
    name: parseData.name,
    description: parseData.description,
  }
}

export async function generateLocation(story: Story, locationName: string): Promise<Location> {
  const parser = StructuredOutputParser.fromNamesAndDescriptions(locationSchema)

  const formatInstruction = parser.getFormatInstructions()

  const composedPrompt = await createFullPrompt(locationPrompt, formatInstruction)

  const location = await composedPrompt.format({
    storyName: story.name,
    storySummary: story.description,
    locationName: locationName,
  })


  const result = await model.call(location)

  const parseData = await parser.parse(result)

  return {
    name: parseData.name,
    description: parseData.description,
    visualSummary: parseData.visualSummary,
  }
}

export async function generateLocationInteraction(interaction: LocationInteractionProps): Promise<GenerateLocationInteractionResponse> {
  const parser = StructuredOutputParser.fromNamesAndDescriptions(locationInteractionSchema)

  const formatInstruction = parser.getFormatInstructions()

  const composedPrompt = await createFullPrompt(locationInteractionPropmt, formatInstruction)

  const locationInteraction = await composedPrompt.format(interaction)

  const result = await model.call(locationInteraction)

  const parseData = await parser.parse(result)

  return {
    scenario: parseData.scenario,
    options: {
      good: parseData.goodChoice,
      evil: parseData.evilChoice,
      neutral: parseData.neutralChoice
    }
  }
}


export async function generateNonPlayerCharacter(npc: NonPlayerCharacterProps): Promise<NonPlayerCharacterResponse> {
  const parser = StructuredOutputParser.fromNamesAndDescriptions(nonPlayerCharacterSchema)

  const formatInstruction = parser.getFormatInstructions()

  const composedPrompt = await createFullPrompt(nonPlayerCharacterPrompt, formatInstruction)

  const nonPlayerCharacter = await composedPrompt.format(npc)

  const result = await model.call(nonPlayerCharacter)

  const parseData = await parser.parse(result)

  return {
    name: parseData.name,
    description: parseData.description,
    visualSummary: parseData.visualSummary,
    initialMessage: parseData.initialMessage,
  }
}

export async function generatePlayerCharacter(player: PlayerCharacterProps): Promise<Based> {
  const parser = StructuredOutputParser.fromNamesAndDescriptions(playerCharacterSchema)

  const formatInstruction = parser.getFormatInstructions()

  const composedPrompt = await createFullPrompt(playerCharacterPrompt, formatInstruction)

  const playerCharacter = await composedPrompt.format(player)

  const result = await model.call(playerCharacter)

  const parseData = await parser.parse(result)

  return {
    name: parseData.name,
    description: parseData.description,
    visualSummary: parseData.visualSummary,
  }
}



































