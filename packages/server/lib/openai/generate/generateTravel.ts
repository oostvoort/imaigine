import { executePrompt } from '../executePrompt'
import { GenerateTravelProps, GenerateTravelResponse } from 'types'


export async function generateTravel(
  props: GenerateTravelProps,
): Promise<GenerateTravelResponse> {
  const prompt = `
    Considering a world like: ${props.story.summary}
    Consider a character like ${props.player.summary}
    Consider a path like ${props.path.summary}

    Tell a story about the character traveling the path in an exciting way
    Don't introduce the character in the story.
    Encode the story as a single JSON with the following format:

    {
        "name": "the name of the journey","summary": "the story",
    }
    `

  const output = await executePrompt(prompt)

  try {
    const json: GenerateTravelResponse = JSON.parse(output)
    return json
  } catch (e) {
    console.error(output)
    console.error(e)
    throw 'Error parsing json'
  }
}
