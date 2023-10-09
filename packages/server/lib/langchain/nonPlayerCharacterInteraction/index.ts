import * as dotenv from 'dotenv'
import { ChatOpenAI } from 'langchain/chat_models'
import process from 'process'
import { z } from 'zod'
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import { createStructuredOutputChainFromZod } from 'langchain/chains/openai_functions'

dotenv.config()

const llm = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo-0613',
  temperature: 1,
  openAIApiKey: process.env.OPENAI_API_KEY,
})

interface NpcDetails {
  name: string,
  summary: string
}
interface Actions {
  positive: string,
  negative: string,
  neutral: string
}
export async function generateNpcMessage(npc: NpcDetails, message?: string) {
  const messageSchema = z.object({
    message: z.string().describe(`
    the generated message of ${npc.name} based on last message if available and don't end the conversation, else create a conversation topic`)
  })

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        `You are a non player character named ${npc.name}, your description is ${npc.summary}`,
      ),
      SystemMessagePromptTemplate.fromTemplate(
        `Generate a response message for ${npc.name} based on the last message if available else create a conversation topic`,
      ),
      HumanMessagePromptTemplate.fromTemplate('{lastMessage}'),
    ],
    inputVariables: [ 'lastMessage' ],
  })

  const chain = createStructuredOutputChainFromZod(messageSchema, {
    prompt,
    llm,
  })

  const response = await chain.call({
    lastMessage: message ? message : 'no available message',
  })

  return response.output.message
}
export async function generateActions(message: string) {
  const actionSchema = z.object({
    positive_action: z.string().describe(`the generated positive action of the adventurer based on the message, should be to two to five words.`),
    negative_action: z.string().describe(`the generated negative action of the adventurer based on the message, should be to two to five words.`),
    neutral_action: z.string().describe(`the generated neutral action of the adventurer based on the message, should be to two to five words.`),
  })

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        `You are a adventurer`,
      ),
      SystemMessagePromptTemplate.fromTemplate(
        `Generate a positive, negative and a neutral action of the adventurer related on the message, should be to two to five words`,
      ),
      HumanMessagePromptTemplate.fromTemplate('{message}'),
    ],
    inputVariables: [ 'message' ],
  })

  const chain = createStructuredOutputChainFromZod(actionSchema, {
    prompt,
    llm,
  })

  const response = await chain.call({
    message: message,
  })

  return {
    negative: response.output.negative_action,
    neutral: response.output.neutral_action,
    positive: response.output.positive_action,
  }
}
export async function generateActionsMessages(npc: NpcDetails,message: string, actions: Actions) {
  const messagesSchema = z.object({
    positive_message: z.string().describe(`the generated positive response message of the adventurer based on the action and ${npc.name} message, should be one to two sentences`),
    negative_message: z.string().describe(`the generated negative response message of the adventurer based on the action and ${npc.name} message, should be one to two sentences`),
    neutral_message: z.string().describe(`the generated neutral response message of the adventurer based on the action and ${npc.name} message, should be one to two sentences`),
  })

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        `You are a adventurer, response like you are talking`,
      ),
      SystemMessagePromptTemplate.fromTemplate(
        `Generate a positive, negative and a neutral response message for the adventurer related on the ${npc.name} message while doing the action, should be one to two sentences`,
      ),
      HumanMessagePromptTemplate.fromTemplate(`${npc.name} message: {message}\n positive action: {positiveAction}, negative action: {negativeAction}, neutral action: {neutralAction}`),
    ],
    inputVariables: [ 'message', 'positiveAction', 'negativeAction', 'neutralAction'],
  })

  const chain = createStructuredOutputChainFromZod(messagesSchema, {
    prompt,
    llm,
  })

  const response = await chain.call({
    message: message,
    positiveAction: actions.positive,
    negativeAction: actions.negative,
    neutralAction: actions.neutral,
  })

  return {
    negative: response.output.negative_message,
    neutral: response.output.neutral_message,
    positive: response.output.positive_message,
  }
}

