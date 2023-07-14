import { BaseConfig } from 'types'
import { getFromIpfs } from './getFromIpfs'
import { BASE_CONFIG_IPFS } from '../global/config'

export async function getBaseConfigFromIpfs() : Promise<BaseConfig> {
  console.info("Getting config from ipfs..")
  const config = await getFromIpfs(BASE_CONFIG_IPFS)

  console.info("Done getting config from ipfs")

  return {
    storyConfig: config.storyConfig,
    startingLocations: config.startingLocations
  }
}
