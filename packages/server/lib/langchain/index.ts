import { StructuredOutputParser } from 'langchain/output_parsers'
import {
  locationInteractionSchema, locationInteractionZodSchema,
  locationSchema,
  nonPlayerCharacterSchema, npcInteractionSchema, npcInteractionZodSchema,
  playerCharacterSchema,
  storySchema, summaryZodSchema,
} from './schemas'
import { OpenAI, PromptTemplate } from 'langchain'
import { PipelinePromptTemplate } from 'langchain/prompts'
import {
  locationInteractionPropmt,
  locationPrompt,
  nonPlayerCharacterPrompt, npcInteractionPrompt,
  playerCharacterPrompt,
  storyPrompt, travelPrompt,
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
  Story, TravelLocationAttributes,
} from 'types'

import { z } from "zod"
import { getStringContent } from '../../utils/getStringContent'
import * as wasi from 'wasi'

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
  try {
    let locationHistory = ''

    locationHistory = interaction.locationHistory.length > 500 ? await summarizeText(interaction.locationHistory) : interaction.locationHistory

    const parser = StructuredOutputParser.fromZodSchema((locationInteractionZodSchema))
    const formatInstruction = parser.getFormatInstructions()
    const prompt = new PromptTemplate({
      template: `
     Consider a world called "{storyName}". {storySummary}\n
     "{locationName}" is a location in {storyName}. The following is its description:\n
     "{locationSummary}"\n
     {locationHistory}
     Consider that the main character is {playerName} is in this location.\n

     {format_instructions}
  `,
      inputVariables: ["storyName", "storySummary", "locationName", "locationSummary", "locationHistory", "playerName"],
      partialVariables: {format_instructions: formatInstruction}
    })

    const input = await prompt.format({
      storyName: interaction.storyName,
      storySummary: interaction.storySummary,
      locationName: interaction.locationName,
      locationSummary: interaction.locationSummary,
      locationHistory: locationHistory,
      playerName: interaction.playerName
    })

    const response = await model.call(input)

    const parseData = await parser.parse(response)

    return {
      scenario: parseData.scenario,
      options: {
        good: {
          choice: parseData.good.choice,
          effect: parseData.good.effect,
        },
        evil: {
          choice: parseData.evil.choice,
          effect: parseData.evil.effect,
        },
        neutral: {
          choice: parseData.neutral.choice,
          effect: parseData.neutral.effect,
        }
      }
    }
  } catch (e) {
    return e
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
  const parser = StructuredOutputParser.fromZodSchema((npcInteractionZodSchema))
  const formatInstruction = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template: `
    Consider a world called "{storyName}". {storySummary}\n
    Consider "{npcName}" an non player character with the following description: "{npcSummary}"\n
    "{conversationHistory}"

    Consider that the non player character (NPC) is having a conversation with the player.\n
    Make the npc responses based on it's personality\n

    Generate a npc response
    Generate 3 choices in 3 to 5 words for the player: a good, negative and neutral\n
    Generate what player will say to the npc: a good, negative and neutral

    {format_instructions}
  `,
    inputVariables: ["storyName", "storySummary", "npcName", "npcSummary", "conversationHistory"],
    partialVariables: {format_instructions: formatInstruction}
  })

  const input = await prompt.format({
    storyName: npcInteraction.storyName,
    storySummary: npcInteraction.storySummary,
    npcName: npcInteraction.npcName,
    npcSummary: npcInteraction.npcSummary,
    conversationHistory: npcInteraction.conversationHistory
  })

  const response = await model.call(input)

  const parseData = await parser.parse(response)

  return {
    evilChoice: parseData.evil.choice,
    evilResponse: parseData.evil.response,
    goodChoice: parseData.good.choice,
    goodResponse: parseData.good.response,
    neutralChoice: parseData.neutral.choice,
    neutralResponse: parseData.neutral.response,
    response: parseData.response
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

export async function generateTravel(locations: string) {

  try {
    const parser = StructuredOutputParser.fromZodSchema((
      z.object({
        travelStory: z.string()
          .describe('travel story of the player like your telling a story, should not be detailed like mentioning numbers and be more creative')
      })
    ))
    const formatInstruction = parser.getFormatInstructions()

    const prompt = new PromptTemplate({
      template: `
      Consider the following location\n
      {locations}\n
      Generate a travel story of the player like your telling in 2 to 3 paragraphs in one line\n
      {format_instructions}
      `,
      inputVariables: ["locations"],
      partialVariables: {format_instructions: formatInstruction}
    })

    const input = await prompt.format({locations: locations})

    const response = await model.call(input)

    const data = getStringContent(response)

    const travelStory: {travelStory: string} = await JSON.parse(removeNewlines(data))

    return travelStory.travelStory
  } catch (e) {
    return e
  }
}

export async function summarizeText(text: string) : Promise<string> {
  console.info("- summarizing text ...")

  try {
    const parser = StructuredOutputParser.fromZodSchema((summaryZodSchema))
    const formatInstruction = parser.getFormatInstructions()

    const prompt = new PromptTemplate({
      template: `
      Generate a summary of the text: "{summary}"
      {format_instructions}
      `,
      inputVariables: ["summary"],
      partialVariables: {format_instructions: formatInstruction}
    })

    const input = await prompt.format({summary: text})

    const response = await model.call(input)

    const parseData = await parser.parse(response)

    console.info("- done summarizing text")

    console.info(parseData.summary)

    return parseData.summary

  } catch (e) {
    console.info(e)
    return e
  }

}
function removeNewlines(str: string): string {
  console.info(str)
  return str.replace(/\n/g, ' ');
}

































