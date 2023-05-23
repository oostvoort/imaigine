import { executePrompt } from '../executePrompt'
import { GenerateInteractionProps, GenerateInteractionResponse } from 'types'
import { loadJson, storeJson } from '../../ipfs'
import { PROMPT_OUTPUT_JSON } from '../utils'

function reputation(name: string, karma: number) {
  if (karma < 0) {
    if (karma < 0) return `${name} not a very nice person`
    else if (karma < -25) return `${name} is generally a naughty and nasty character`
    else if (karma < -50) return `${name} is considered a criminal and the worse of the world`
    else if (karma < -75) return `${name} is an extremely bad character and hated`
    else if (karma < -100) return `${name} is terrible and fearsome and considered the greatest evil`
  } else {
    if (karma > -1) return `${name} is not good or bad, very neutral`
    else if (karma > 25) return `${name} is a decent character`
    else if (karma > 50) return `${name} is an awesome character, generally loved `
    else if (karma > 75) return `${name} is one of he best in the world, loved and revered`
    else if (karma > 100) return `${name} is considered a deity, revered and loved and prayed to`
  }

}

export async function generateInteraction({
  mode,
  storySummary,
  location,
  activeEntity,
  otherEntities,
  logHash,
  action,
}: GenerateInteractionProps): Promise<GenerateInteractionResponse> {

  let log = await loadJson(logHash, [])


  const initial = action.length === 0

  const isAlive = mode === 'interactable' ? otherEntities[0].isAlive : false
  const orSpoken = isAlive ? 'or spoken dialog' : ''

  const outputTemplate = {
    'name': 'the name of whoever reacts',
    'summary': `summary of the interaction `,
    'possible': [
      { mode: 'dialog', content: `dialog for ${activeEntity.name}`, effect: { karmaChange: 0 } },
      {
        mode: 'action',
        content: `action for ${activeEntity.name}`,
        effect: {
          karmaChange: 0,
        },
      },
    ],
  }
  const interacting = initial ? `going to interact` : `currently interacting`
  const logs = initial ? '' : `Consider the previous relevant events: ${log.join(', ')}.`

  const interactablePrompt = mode === 'interactable' ? `${activeEntity.name} is ${interacting} with ${otherEntities[0].name}.` : ''
  const otherChars = mode === 'interactable' ? `The other characters in the situation are: "${otherEntities[0].summary}".` : ''

  const prompt = `
    ${process.env.GLOBAL_AI_PROMPT_PREFIX}
    ${logs}
    Consider a world like this: ${storySummary}
    Main character is ${activeEntity.summary}, and ${reputation(activeEntity.name, activeEntity.karma)}.
    ${otherChars}
    Everything takes place in ${location.name}, described as ${location.summary}.
    ${interactablePrompt}
    Give me 5 future actions ${orSpoken} by ${activeEntity.name}, with their possible effects on karma, encoded in the json
    The actions can not have speech. The dialog has to be as if  ${activeEntity.name} speaks.
    Karma changes are between -5 and 5, depending on whether the action would do evil or good.

    ${PROMPT_OUTPUT_JSON}.
    ${JSON.stringify(outputTemplate)}
    `

  const output = await executePrompt(prompt)

  try {
    const json: GenerateInteractionResponse = JSON.parse(output)

    log.push(json.summary)

    const hash = await storeJson(log)

    json.logHash = hash

    return json
  } catch (e) {
    console.error(output, e)
    throw 'Error parsing json'
  }
}
