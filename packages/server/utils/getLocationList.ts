import { getFromIpfs } from './getFromIpfs'
import { LOCATION_LIST_IPFS } from '../global/config'

interface Location {
  name: string
  cellNumber: number,
}
export async function getLocationList(): Promise<Array<Location>> {

  const result = await getFromIpfs(LOCATION_LIST_IPFS)

  return result.locations as Location[]
}


export function getLocationDetails(locations: Array<Location>, locationEntityId: number): Location | undefined {
  console.log(locations)
  return locations.find(loc => loc.cellNumber === locationEntityId)
}
