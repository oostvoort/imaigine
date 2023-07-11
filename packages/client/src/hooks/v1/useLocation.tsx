import { useMUD } from '@/MUDContext'
import { useComponentValue } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { convertLocationNumberToLocationId, getFromIPFS } from '@/global/utils'
import { GenerateLocationProps, GenerateLocationResponse, LocationParam } from '@/global/types'
import { useMutation } from '@tanstack/react-query'
import { SERVER_API } from '@/global/constants'

export default function useLocation(locationIdParam?: LocationParam) {
  const locationIdInContract = typeof locationIdParam === "string" ?
    locationIdParam : convertLocationNumberToLocationId(locationIdParam ?? 0)

  console.log('locParams', locationIdInContract)

  const {
    components: {
      ConfigComponent,
      SceneComponent,
      ImageComponent,
      InteractionTypeComponent,
    }
  } = useMUD()

  const location = {
    config: useComponentValue(ConfigComponent, locationIdInContract as Entity),
    scene: useComponentValue(SceneComponent, locationIdInContract as Entity),
    imgHash: useComponentValue(ImageComponent, locationIdInContract as Entity),
    interactionType: useComponentValue(InteractionTypeComponent, locationIdInContract as Entity),
  }

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

        console.log({response})

        const data = await response.json() as GenerateLocationResponse
        const getDataFromIPFS = await getFromIPFS(data.ipfsHash)
        const ipfsData = await getDataFromIPFS.json();

        console.log({data})
        console.log({ipfsData})

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
