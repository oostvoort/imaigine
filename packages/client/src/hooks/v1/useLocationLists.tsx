import { useQuery } from '@tanstack/react-query'
import { convertLocationNumberToLocationId, getFromIPFS } from '@/global/utils'
import { useMUD } from '@/MUDContext'
import { Has } from '@latticexyz/recs'
import { LocationParam } from '@/global/types'
import { useEntityQuery } from '@latticexyz/react'

const locationListsIPFS =  import.meta.env.VITE_LOCATION_LIST_IPFS

const locationIdConverter = (locationId?: LocationParam) => {
  return typeof locationId === "string" ?
    locationId : convertLocationNumberToLocationId(locationId ?? 0)
}

export default function useLocationLists(revealedCells?: Array<number>) {
  const {
    components: {
      SceneComponent,
    }
  } = useMUD()

  const locationIds = useEntityQuery([
    Has(SceneComponent)
  ])

  const locationLists = useQuery(
    ['locationList'],
    async () => {
      if (!locationListsIPFS) throw new Error('IPFS location lists is empty!')
      const response = await getFromIPFS(locationListsIPFS)
      const data = await response.json()

      return {
        locations: data.locations
      }
    }, {
      staleTime: Infinity,
    }
  )

  const burgCells = revealedCells?.filter(element =>
    locationLists.data?.locations.some((obj: { cellNumber: number }) => obj.cellNumber === element)
  )

  const cellToId = burgCells?.map((res) => {
    return {
      id: locationIdConverter(res),
      cell: res
    }
  })

  const locationToGenerate = cellToId?.filter(element =>
    !locationIds.some((entityId) => entityId === element.id)
  )

  return { locationToGenerate }
}
