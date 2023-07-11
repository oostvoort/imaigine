import { useMUD } from '@/MUDContext'
import { useComponentValue } from '@latticexyz/react'
import { Entity, getComponentValueStrict, Has, HasValue, runQuery } from '@latticexyz/recs'
import { convertLocationNumberToLocationId, getFromIPFS } from '@/global/utils'
import { GenerateLocationProps, GenerateLocationResponse, LocationParam } from '@/global/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SERVER_API } from '@/global/constants'

export default function useLocation(locationIdParam?: LocationParam) {
  const locationIdInContract = typeof locationIdParam === "string" ?
    locationIdParam : convertLocationNumberToLocationId(locationIdParam ?? 0)

  const {
    components: {
      ConfigComponent,
      SceneComponent,
      ImageComponent,
      InteractionTypeComponent,
    }
  } = useMUD()


  const location = useQuery(
    [ `location-${locationIdParam}` ],
    async () => {
      if (!locationIdInContract) throw new Error('No location id')
      console.info('getting location')
      const locationIds = runQuery([
        Has(ConfigComponent),
        Has(SceneComponent),
        Has(ImageComponent),
        Has(InteractionTypeComponent)
      ]).values()

      const locationId = Array.from(locationIds).find((entityId) => locationIdInContract === entityId)

      if (locationId) {
        const config = getComponentValueStrict(ConfigComponent, locationId as Entity).value
        const scene = getComponentValueStrict(SceneComponent, locationId as Entity)
        const imgHash = getComponentValueStrict(ImageComponent, locationId as Entity)
        const interactionType = getComponentValueStrict(InteractionTypeComponent, locationId as Entity)
        const configData = await getFromIPFS(config)
        const result = await configData.json()

        return {
          config: {
            value: config,
            ...result
          },
          scene,
          imgHash,
          interactionType
        }
      }

      return null
    }, {
      enabled: Boolean(locationIdParam),
      staleTime: Infinity
    })

  const generateLocation = useMutation({
    mutationKey: [ 'generate-location' ],
    mutationFn: async (variables: GenerateLocationProps) => {
      console.log('gen-location', variables.id)
      try {
        const response = await fetch(`${SERVER_API}/api/v1/generate-location`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: variables.id }),
        });

        const data = await response.json() as GenerateLocationResponse
        const getDataFromIPFS = await getFromIPFS(data.ipfsHash)
        const ipfsData = await getDataFromIPFS.json();

        return {
          ...data,
          ...ipfsData
        }
      } catch (error) {
        console.error('[generateLocation]', error)
      }
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async (data: any) => {
      console.info('location', data)
    },
    onError: (err) => {
      console.error(err)
    },
  })

  return { location, generateLocation }
}
