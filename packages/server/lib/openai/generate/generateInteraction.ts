import { executePrompt } from '../executePrompt'
import { GenerateInteractionProps, GenerateInteractionResponse } from 'types'
import { loadJson, storeJson } from '../../ipfs'


export async function generateInteraction({
  activeEntity,
  otherEntities,
  logHash,
  action,
}: GenerateInteractionProps): Promise<GenerateInteractionResponse> {
  let log = await loadJson(logHash, [])

  const outputTemplate = {
    'name': 'the name of whoever reacts',
    'summary': `summary of the interaction between ${activeEntity.name} and ${otherEntities[0].summary} `,
    'dialog': `what ${otherEntities[0].summary} says`,
    'inventoryChange': {
      'itemAdded': '(if applicable) item that was acquired in the action',
      'itemRemoved': '(if applicable) item that was removed in the action ',
    },
    'currencyChange': 0,
    'actions': [
      `description of action possible for ${activeEntity.name}`,
    ],
  }

  const PROMPT_ALIVE = `Consider an interaction in which a main character described as "${activeEntity.summary}" is going to do something.

    Consider that ${activeEntity.name} is loved by everyone.

    Consider the previous events: ${log.join(', ')}.

    The other characters are described like: "${otherEntities[0].summary}"

    If the action involves currency, always specify an amount as integer.

    The main character ${activeEntity.name} has chosen to "${action}" from ${otherEntities[0].name}

    Give me 3 potential further actions by ${activeEntity.name} and 1 dialog line by ${otherEntities[0].name} that is a likely result of "${action}".

    Describe which items in the inventory of ${activeEntity.name} changed due to the action

    Describe the change in gold in the wallet of ${activeEntity.name} due to the action.`

  const PROMPT_NOT_ALIVE = `Consider an interaction in which a main character described as "${activeEntity.summary}" is going to do something.

    Consider that ${activeEntity.name} is loved by everyone.

    Consider the previous events: ${log.join(', ')}.

    The other characters are described like: "${otherEntities[0].summary}"

    If the action involves currency, always specify an amount as integer.

    The main character ${activeEntity.name} has chosen to "${action}" from ${otherEntities[0].name}

    Give me 3 potential further actions by ${activeEntity.name} and 1 dialog line by ${otherEntities[0].name} that is a likely result of "${action}".

    Describe which items in the inventory of ${activeEntity.name} changed due to the action

    Describe the change in gold in the wallet of ${activeEntity.name} due to the action.`

  let p = otherEntities[0].isAlive ? PROMPT_ALIVE : PROMPT_NOT_ALIVE

  const prompt = ` ${process.env.GLOBAL_AI_PROMPT_PREFIX}
    ${p}

    Respond to me in pure JSON with the following format:

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
