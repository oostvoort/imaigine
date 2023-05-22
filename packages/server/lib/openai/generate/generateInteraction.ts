import { executePrompt } from '../executePrompt'
import { GenerateInteractionProps, GenerateInteractionResponse } from 'types'


export async function generateInteraction({
  activeEntitySummary,
  otherEntitySummaries,
  logHash,
  action,
}: GenerateInteractionProps): Promise<GenerateInteractionResponse> {
  const prompt = `
    Consider an interaction in which a main character described as "${activeEntitySummary}" is going to do something.

    Consider that the main character currently has a bad reputation in the area.

    The other characters are described like: "${otherEntitySummaries[0]}"

    The main character has chosen to do "${action}"

    Give me an action or a dialog line that is a likely result of the action.

    Respond only in JSON with the following format:

    {
        "name": "",
        "summary": "the result of the action being taken ",
    }
    `

  const output = await executePrompt(prompt)

  try {
    const json: GenerateInteractionResponse = JSON.parse(output)
    return json
  } catch (e) {
    console.error(output, e)
    throw 'Error parsing json'
  }
}
