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

  const outputTemplate = initial ? {
    'name': `${otherEntities[0].name}`,
    'summary': 'situation',
    'inventoryChange': {
      'itemAdded': '(if applicable) item that was acquired in the action',
      'itemRemoved': '(if applicable) item that was removed in the action ',
    },
    'currencyChange': 0,
    'possible': [
      { mode: 'dialog', content: `dialog for ${activeEntity.name}` },
      { mode: 'action', content: `action for ${activeEntity.name}` },
    ],
  } : {
    'name': 'the name of whoever reacts',
    'summary': `summary of the interaction between ${activeEntity.name} and ${otherEntities[0].name} `,
    'inventoryChange': {
      'itemAdded': '(if applicable) item that was acquired in the action',
      'itemRemoved': '(if applicable) item that was removed in the action ',
    },
    'currencyChange': 0,
    'possible': [
      { mode: 'dialog', content: `dialog for ${activeEntity.name}` },
      { mode: 'action', content: `action for ${activeEntity.name}` },
    ],
  }

  const PROMPT_ALIVE = initial ? `

  Consider a world like this: ${storySummary}
  Main character is ${activeEntity.summary}, and ${prompt_player_reputation}.
  The other characters in the situation are: "${otherEntities[0].summary}".
  Everything takes place in ${location.name}, described as ${location.summary}.
  Main character is going to interact with ${otherEntities[0].name}.
  Give me 5 further actions or spoken dialog by ${activeEntity.name}, with their content.
  The actions can not have speech. The dialog has to be as if  ${activeEntity.name} speaks.


  ` : `
  Consider an interaction in which a main character described as "${activeEntity.summary}" is going to do something.
    ${prompt_player_reputation}


    Consider the previous events: ${log.join(', ')}.

    Consider a world like this: ${storySummary}
    Main character is ${activeEntity.summary}, and ${prompt_player_reputation}.
    The other characters in the situation are: "${otherEntities[0].summary}".
    Everything takes place in ${location.name}, described as ${location.summary}.
    Main character is going to interact with ${otherEntities[0].name}.

    Describe which items in the inventory of ${activeEntity.name} changed due to the action
    Describe the change in currency in the wallet of ${activeEntity.name} due to the action.

    Give me 5 further actions or spoken dialog by ${activeEntity.name}, with their content.
    The actions can not have speech. The dialog has to be as if  ${activeEntity.name} speaks.
  `


  const PROMPT_NOT_ALIVE = initial ? `
  Consider an interaction in which a main character described as "${activeEntity.summary}" is going to do something.
${prompt_player_reputation}


    The item are described like: "${otherEntities[0].summary}"

    If the action involves currency, always specify an amount as integer.

    Give me 3 potential actions by ${activeEntity.name} .

    ` : `
    Consider an interaction in which a main character described as "${activeEntity.summary}" is going to do something.

    ${prompt_player_reputation}


    Consider the previous events: ${log.join(', ')}.

    The other characters are described like: "${otherEntities[0].summary}"

    If the action involves currency, always specify an amount as integer.

    The main character ${activeEntity.name} has chosen to "${action}" from ${otherEntities[0].name}

    Give me 3 potential further actions by ${activeEntity.name}.

    Describe which items in the inventory of ${activeEntity.name} changed due to the action

    Describe the change in gold in the wallet of ${activeEntity.name} due to the action.`

  let p = otherEntities[0].isAlive ? PROMPT_ALIVE : PROMPT_NOT_ALIVE


  const prompt = `
   ${process.env.GLOBAL_AI_PROMPT_PREFIX}
    ${p}

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
