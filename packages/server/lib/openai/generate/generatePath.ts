import { executePrompt } from '../executePrompt'
import { GeneratePathProps, GeneratePathResponse } from 'types'


export async function generatePath(
  { story, toLocation, fromLocation }: GeneratePathProps,
): Promise<GeneratePathResponse> {
  const prompt = `
    In the context of a world described as ${story.summary}
    Generate a vivid description of a path that will connect two locations
    Explain how the path is logical and makes sense
    Give details on how the transition from moving from the first location to the second
    Give the path a very unique name
    The description should be like travel brochure

    Name of the first location: "${fromLocation.name}"
    Description of the first location: "${fromLocation.summary}"

    Name of the second location: "${toLocation.name}"
    Description of the second location: "${toLocation.summary}"

    Respond only in JSON with the following format:

    {
        "name": "the name of the location",
        "summary": "the generated description",
    }
    `

  const output = await executePrompt(prompt)


  try {
    const json: GeneratePathResponse = JSON.parse(output)
    return json
  } catch (e) {
    console.error(output, e)
    throw 'Error parsing json'
  }
}
