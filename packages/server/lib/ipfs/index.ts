import * as dotenv from 'dotenv'

import pinataSDK from '@pinata/sdk'
import { PinataPinOptions } from '@pinata/sdk/src/commands/pinning/pinFileToIPFS'

dotenv.config()

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
})


export async function storeJson(json: any): Promise<string> {
  const testOptions = {
    pinataMetadata: {
      name: 'test',
    },
  }

  const options: PinataPinOptions = process.mainModule.path.indexOf('mocha') >= 0 ? testOptions : {}

  const hash = (await pinata.pinJSONToIPFS(json, options)).IpfsHash
  return hash
}

export async function remove(hash: string) {
  if (hash.length === 0) return
  await pinata.unpin(hash)
}

export async function loadJson<T>(hash: string, defaultResult: T): Promise<T> {

  if (hash.length === 0) return defaultResult

  try {
    return await (await fetch(
      `${process.env.IPFS_URL_PREFIX}/${hash}`,
      { method: 'GET' },
    )).json()
  } catch (e) {
    console.error(e)
  }


  return defaultResult
}
