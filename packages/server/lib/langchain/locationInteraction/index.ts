import { z } from 'zod'
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import { ChatOpenAI } from 'langchain/chat_models'
import { createStructuredOutputChainFromZod } from 'langchain/chains/openai_functions'
import * as dotenv from 'dotenv'
import * as process from 'process'
dotenv.config()
export interface InteractLocationProps {
  inputText: string
}
interface GenerateLocationInteractionProps {
  storyName: string,
  storySummary: string,
  locationName: string,
  locationSummary: string,
  playerName: string,
  playerSummary: string,
  locationHistory: string,
}
interface Actions {
  positive: string,
  negative: string,
  neutral: string
}

const llm = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo-0613',
  temperature: 1,
  openAIApiKey: process.env.OPENAI_API_KEY,
})
export async function generateScenario(props: InteractLocationProps) {
  const interactionLocationSchema = z.object({
    scenario: z.string().describe('the generated scenario based on location history if available, should be in one 3 sentences'),
  })

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        'You are a story teller in a fantasy world',
      ),
      SystemMessagePromptTemplate.fromTemplate(
        'Generate a scenario based the location history if available, else invent one',
      ),
      HumanMessagePromptTemplate.fromTemplate('{inputText}'),
    ],
    inputVariables: [ 'inputText' ],
  })

  const chain = createStructuredOutputChainFromZod(interactionLocationSchema, {
    prompt,
    llm,
  })

  const response = await chain.call({
    inputText: props.inputText,
  })

  return response.output.scenario
}
export async function generateActions(scenario: string): Promise<Actions> {

  const actionSchema = z.object({
    positive_action: z.string().describe(`the generated positive action of the player based on the scenario, should be to two to five words. Dont mention names`),
    negative_action: z.string().describe(`the generated negative action of the player based on the scenario, should be to two to five words. Dont mention names`),
    neutral_action: z.string().describe(`the generated neutral action of the player based on the scenario, should be to two to five words. Dont mention names`),
  })

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        'You are a story teller in a fantasy world',
      ),
      SystemMessagePromptTemplate.fromTemplate(
        `Generate a positive, negative and a neutral action of the player based on the scenario, should be to two to five words. Dont mention names`,
      ),
      HumanMessagePromptTemplate.fromTemplate('{scenario}'),
    ],
    inputVariables: [ 'scenario' ],
  })


  const chain = createStructuredOutputChainFromZod(actionSchema, {
    prompt,
    llm,
  })

  const response = await chain.call({
    scenario: scenario,
  })

  return {
    negative: response.output.negative_action,
    neutral: response.output.neutral_action,
    positive: response.output.positive_action,
  }
}
export async function generateEffect(scenario: string, action: string) {

  const effectSchema = z.object({
    effect: z.string().describe('the generated effect based on scenario and action, should be in 1 sentence'),
  })

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        'You are a story teller in a fantasy world',
      ),
      SystemMessagePromptTemplate.fromTemplate(
        'Generate an effect based on scenario and the action, should be in 1 sentence',
      ),
      HumanMessagePromptTemplate.fromTemplate(`the scenario :{scenario}\n the action the player do: {action}`),
    ],
    inputVariables: [ 'scenario', 'action' ],
  })

  const chain = createStructuredOutputChainFromZod(effectSchema, {
    prompt,
    llm,
  })

  const response = await chain.call({
    scenario: scenario,
    action: action,
  })

  return response.output.effect
}
export async function generateInteractLocation(props: GenerateLocationInteractionProps) {

  const text = `
    The world name is ${props.storyName}, ${props.storySummary}\n
    There is a location named ${props.locationName}, ${props.locationSummary}\n
    ${props.playerName} a adventurer, ${props.playerSummary}\n

    Location History: ${props.locationHistory}
  `

  const scenario = await generateScenario({ inputText: text })
  const actions = await generateActions(scenario)

  return {
    scenario, actions
  }
}
