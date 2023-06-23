import { getFromIpfs } from './getFromIpfs'
import * as process from 'process'

interface Location {
  name: string
  entityId: string,
}
export async function getLocationList(): Promise<Array<Location>> {

  const convertedArray: Array<Location> = [];
  const result = await getFromIpfs(process.env.LOCATION_LIST_IPFS)

  result.locations.forEach((location: any) => {
    const entityId = Object.keys(location)[0];
    const name = location[entityId]

    convertedArray.push({
      name: name,
      entityId: entityId
    })
  })

  return convertedArray
}


export function getLocationDetails(locations: Array<Location>, locationEntityId: string): Location | undefined {
  return locations.find(loc => loc.entityId === locationEntityId)
}
