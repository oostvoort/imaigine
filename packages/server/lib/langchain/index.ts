import { StructuredOutputParser } from 'langchain/output_parsers'
import {
  locationInteractionSchema,
  locationSchema,
  nonPlayerCharacterSchema, npcInteractionSchema,
  playerCharacterSchema,
  storySchema,
} from './schemas'
import { OpenAI, PromptTemplate } from 'langchain'
import { PipelinePromptTemplate } from 'langchain/prompts'
import {
  locationInteractionPropmt,
  locationPrompt,
  nonPlayerCharacterPrompt, npcInteractionPrompt,
  playerCharacterPrompt,
  storyPrompt,
} from './templates'
import {
  Based,
  Location,
  LocationInteractionProps,
  NonPlayerCharacterProps,
  NonPlayerCharacterResponse, NpcInteractionProps,
  PlayerCharacterProps,
} from './types'
import * as dotenv from 'dotenv'
import {
  GenerateStoryProps,
  GenerateStoryResponse,
  InteractSingleDoneResponse,
  Story,
} from 'types'

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

export async function generateLocationInteraction(interaction: LocationInteractionProps): Promise<InteractSingleDoneResponse> {
  const parser = StructuredOutputParser.fromNamesAndDescriptions(locationInteractionSchema)

  const formatInstruction = parser.getFormatInstructions()

  const composedPrompt = await createFullPrompt(locationInteractionPropmt, formatInstruction)

  const locationInteraction = await composedPrompt.format(interaction)

  const result = await model.call(locationInteraction)

  const parseData = await parser.parse(result)

  return {
    scenario: parseData.scenario,
    options: {
      good: {
        choice: parseData.goodChoice,
        effect: parseData.goodEffect,
      },
      evil: {
        choice: parseData.evilChoice,
        effect: parseData.evilEffect,
      },
      neutral: {
        choice: parseData.neutralChoice,
        effect: parseData.neutralEffect,
      }
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

export async function generateNpcInteraction(npcInteraction: NpcInteractionProps): Promise<{
  response: string,
  goodChoice: string,
  evilChoice: string,
  neutralChoice: string,
  goodResponse: string,
  evilResponse: string,
  neutralResponse: string
}
> {
  const parser = StructuredOutputParser.fromNamesAndDescriptions(npcInteractionSchema)

  const formatInstruction = parser.getFormatInstructions()

  const composedPrompt = await createFullPrompt(npcInteractionPrompt, formatInstruction)

  const locationInteraction = await composedPrompt.format(npcInteraction)

  const result = await model.call(locationInteraction)

  const parseData = await parser.parse(result)

  return {
    response: parseData.response,
    goodChoice: parseData.goodChoice,
    evilChoice: parseData.evilChoice,
    neutralChoice: parseData.neutralChoice,
    goodResponse: parseData.goodResponse,
    evilResponse: parseData.evilResponse,
    neutralResponse: parseData.neutralResponse
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



































