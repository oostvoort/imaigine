import { pinata, promptTemplates } from './index'
import { Readable } from 'stream'
import { ReadableStream } from 'node:stream/web'


export async function generateNpc(prompt: string): Promise<string> {
  // TODO
  return ''
}

export async function generateLocation(prompt: string): Promise<string> {
  // TODO
  return ''

}

export async function generateItem(prompt: string): Promise<string> {
  // TODO
  return ''

}

export async function generatePlayerImage(prompt: string): Promise<string> {
  const result = await executePrompt('character', prompt)
  return result
}

async function executePrompt(mode: string, rawPrompt: string): Promise<string> {


  const prompt = promptTemplates[mode].prompt.replace('%', rawPrompt)

  const params = promptTemplates[mode]

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


  const pinResponse = await pinata.pinFileToIPFS(
    Readable.fromWeb(<ReadableStream>readableStream.body),
    {
      pinataMetadata: {
        name: 'test',
      },
      pinataOptions: {
        cidVersion: 0,
      },
    })

  return pinResponse.IpfsHash


}
