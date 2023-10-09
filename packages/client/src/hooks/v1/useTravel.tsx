import { useMutation } from '@tanstack/react-query'
import { GenerateTravelResponse } from '../../../../types'
import { SERVER_API } from '@/global/constants'
import { useMUD } from '@/MUDContext'

// generateLocation(cellId)

// prepareTravel
// generateTravel
// travel -- call every 15s

// generateNPC
// interactLocation

export default function useTravel() {
  const {
    network: {
      playerEntity
    },
  } = useMUD();

  const generateTravel = useMutation({
    mutationKey: [ 'generate-travel' ],
    mutationFn: async () => {
      try {
        const response = await fetch(`${SERVER_API}/api/v1/generate-travel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerEntityId: playerEntity }),
        });

        const data = await response.json()
        return {
          travelStory: data.travelStory
        } as GenerateTravelResponse
      } catch (error) {
        console.error('[generateTravel]', error)
      }
    },
    retry: 5,
    retryDelay: 1000,
    onError: (err) => {
      console.error(err)
    },
  })

  return { generateTravel }
}
