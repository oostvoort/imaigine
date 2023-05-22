import openai from './openai'
import { cleanAiJsonAnswer } from './utils'

export async function executePrompt(prompt: string): Promise<string> {
  if (process.env.LOG_PROMPTS == 'true') console.log(`OpenAIPrompt: `, prompt)
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })
  console.log(response.data.usage)
  let responseText = response.data.choices[0].text
  responseText = cleanAiJsonAnswer(responseText)
  return responseText.replace(/^\s+|\n/g, '').trimStart()
}

