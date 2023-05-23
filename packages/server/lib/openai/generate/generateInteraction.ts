import { executePrompt } from '../executePrompt'
import { GenerateInteractionProps, GenerateInteractionResponse } from 'types'
import { loadJson, storeJson } from '../../ipfs'
import { PROMPT_OUTPUT_JSON } from '../utils'


export async function generateInteraction({
  storySummary,
  location,
  activeEntity,
  otherEntities,
  logHash,
  action,
}: GenerateInteractionProps): Promise<GenerateInteractionResponse> {

  let log = await loadJson(logHash, [])

  const initial = action.length === 0

  // TODO make reputation a param
  const prompt_player_reputation = `Consider ${activeEntity.name} is hated and spat on in the country.`

  const isAlive = otherEntities[0].isAlive
  const orSpoken = isAlive ? 'or spoken dialog' : ''

  const outputTemplate = {
    'name': 'the name of whoever reacts',
    'summary': `summary of the interaction between ${activeEntity.name} and ${otherEntities[0].name} `,
    'possible': [
      { mode: 'dialog', content: `dialog for ${activeEntity.name}`, effect: { karmaChange: 0 } },
      {
        mode: 'action',
        content: `action for ${activeEntity.name}`,
        effect: {
          karmaChange: 0,
          inventoryChange: { itemAdded: '', itemRemoved: '' },
          currencyChange: 0,
          healthChange: 0,
        },
      },
    ],
  }
  const interacting = initial ? `going to interact` : `currently interacting`
  const logs = initial ? '' : `Consider the previous relevant events: ${log.join(', ')}.`


  const prompt = `
    ${process.env.GLOBAL_AI_PROMPT_PREFIX}
    ${logs}
    Consider a world like this: ${storySummary}
    Main character is ${activeEntity.summary}, and ${prompt_player_reputation}.
    The other characters in the situation are: "${otherEntities[0].summary}".
    Everything takes place in ${location.name}, described as ${location.summary}.
    ${activeEntity.name} is ${interacting} with ${otherEntities[0].name}.
    Give me 5 further actions ${orSpoken} by ${activeEntity.name}, with their possible effects on inventory, currency, health and karma.
    The actions can not have speech. The dialog has to be as if  ${activeEntity.name} speaks.
    Karma changes are between -5 and 5, depending on whether the action would do evil or good.

    ${PROMPT_OUTPUT_JSON}
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
