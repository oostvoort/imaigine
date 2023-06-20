import { pinata, promptTemplates } from './index'
import { Readable } from 'stream'
import { ReadableStream } from 'node:stream/web'

export async function generateNpcImage(prompt: string): Promise<string> {
  const result = await executePrompt('npc', prompt)
  return result
}

export async function generateLocationImage(prompt: string): Promise<string> {
  const result = await executePrompt('location', prompt)
  return result

}

export async function generateItemImage(prompt: string): Promise<string> {
  const result = await executePrompt('item', prompt)
  return result

}

export async function generatePlayerImage(prompt: string): Promise<string> {
  const result = await executePrompt('character', prompt)
  return result
}

async function executePrompt(mode: string, rawPrompt: string): Promise<string> {

  const prompt = promptTemplates[mode].prompt.replace('%', rawPrompt)

  if (process.env.LOG_PROMPTS == 'true') console.log(`Leonardo Prompt: `, prompt)

  const params = promptTemplates[mode]
  console.debug('prompting Leonardo')
  const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
    },
    body: JSON.stringify({
      ...params,
      prompt,
    }),
  })
  const json = await response.json()
  const generationId = json.sdGenerationJob.generationId

  console.debug('waiting Leonardo')

  let images = []
  let result
  while (images.length === 0) {

    result = (await (await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
      },

    })).json()).generations_by_pk

    images = result.generated_images

    await new Promise(r => setTimeout(r, 1000))
  }


  const readableStream = await fetch(images[0].url, {
    method: 'GET',
  })

  console.debug('pinning')

  const pinResponse = await pinata.pinFileToIPFS(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    Readable.fromWeb(<ReadableStream>readableStream.body),
    {
      pinataMetadata: {
        name: 'test',
      },
      pinataOptions: {
        cidVersion: 0,
      },
    })
  console.debug('returning hash')

  return pinResponse.IpfsHash


}
