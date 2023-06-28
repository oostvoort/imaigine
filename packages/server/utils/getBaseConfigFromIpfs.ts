import { BaseConfig } from 'types'
import { getFromIpfs } from './getFromIpfs'
import * as process from 'process'

export async function getBaseConfigFromIpfs() : Promise<BaseConfig> {
  console.info("Getting config from ipfs..")
  const config = await getFromIpfs(process.env.BASE_CONFIG_IPFS)

  console.info("Done getting config from ipfs")

  return {
    storyConfig: config.storyConfig,
    startingLocations: config.startingLocations
  }
}
