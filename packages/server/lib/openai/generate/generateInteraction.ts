import { executePrompt } from '../executePrompt'
import { GenerateInteractionProps, GenerateInteractionResponse } from 'types'


export async function generateInteraction(props: GenerateInteractionProps): Promise<GenerateInteractionResponse> {
  const prompt = `
    TODO

    Respond only in JSON with the following format:

    {
        "name": "the name of the location",
        "summary": "the generated description",
    }
    `

  const output = await executePrompt(prompt)
  const json: GenerateInteractionResponse = JSON.parse(output)
  return json
}
