import { getFromIpfs } from './getFromIpfs'
import * as process from 'process'

interface Location {
  name: string
  cellNumber: number,
}
export async function getLocationList(): Promise<Array<Location>> {

  const result = await getFromIpfs(process.env.LOCATION_LIST_IPFS)

  return result.locations as Location[]
}


export function getLocationDetails(locations: Array<Location>, locationEntityId: number): Location | undefined {
  console.log(locations)
  return locations.find(loc => loc.cellNumber === locationEntityId)
}
