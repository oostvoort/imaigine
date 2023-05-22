import openai from './openai'

export async function executePrompt(prompt: string): Promise<string> {
  if (process.env.LOG_PROMPTS == 'true') console.log(`Prompt: ${prompt}`)
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })
  const responseText = response.data.choices[0].text
  return responseText.replace(/^\s+|\n/g, '').trimStart()
}

