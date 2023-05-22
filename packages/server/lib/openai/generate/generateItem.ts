import { executePrompt } from '../executePrompt'
import { GenerateItemProps, GenerateItemResponse } from 'types'


export async function generateItem(
  { story, name }: GenerateItemProps,
): Promise<GenerateItemResponse> {
  const prompt = `
    In the context of a world described as ${story.summary}

    Give a vivid description of an item with the name: "${name}".
    Give the value in currency units.

    Describe the location visually

    Respond only in JSON with the following format:

    {
        "name": "the name of the location",
        "summary": "the generated description",
        "value": "value in currency units, as signed integer",
        "visualSummary": "a string of comma separated keywords describing the item"
    }
    `

  const output = await executePrompt(prompt)


  try {
    const json: GenerateItemResponse = JSON.parse(output)
    json.visualSummary = `${json.name} : ${json.visualSummary}`
    return json
  } catch (e) {
    console.error(output, e)
    throw 'Error parsing json'
  }
}
