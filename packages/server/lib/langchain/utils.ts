import { z } from 'zod'
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import { ChatOpenAI } from 'langchain/chat_models'
import process from 'process'
import { createStructuredOutputChainFromZod } from 'langchain/chains/openai_functions'

const llm = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo-0613',
  temperature: 1,
  openAIApiKey: process.env.OPENAI_API_KEY,
})
export async function summarizeText(text: string) {

  const summarySchema = z.object({
    summary: z.string().describe("the generated summary, should be in 3 to 5 sentences")
  })

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate('You are a story teller'),
      SystemMessagePromptTemplate.fromTemplate("Generate a summary based on the following text"),
      HumanMessagePromptTemplate.fromTemplate('{text}')
    ],
    inputVariables: ['text']
  })

  const chain = createStructuredOutputChainFromZod(summarySchema, {
    prompt,
    llm,
  })

  const response = await chain.call({text: text})

  return response.output.summary
}
