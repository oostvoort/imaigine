import { useMUD } from '@/MUDContext'
import usePlayer from '@/hooks/v1/usePlayer'
import useLocation from '@/hooks/v1/useLocation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IS_MOCK, SERVER_API } from '@/global/constants'
import { LocationInteractionResponse } from '../../../../types'
import { BigNumber } from 'ethers'
import { awaitStreamValue } from '@latticexyz/utils'

export default function useLocationInteraction() {
  const {
    network: {
      worldSend,
      txReduced$,
      playerEntity,
    }
  } = useMUD()

  const queryClient = useQueryClient()

  const { player } = usePlayer()
  const locationId = player.location?.value
  const { location } = useLocation(locationId ?? undefined)

  const data = {
    playerEntityId: playerEntity,
    locationEntityId: player.location?.value,
    locationIpfsHash: location.data?.config.value,
    playerIpfsHash: player.config?.value,
  }

  const generateLocationInteraction = useMutation({
    mutationKey: ['generate-location-interaction'],
    mutationFn: async () => {
      try {
        const response = await fetch(`${SERVER_API}/api/v1/interact-location`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, mock: IS_MOCK }),
        })

        return await response.json() as LocationInteractionResponse
      } catch (error) {
        console.error('[generateLocationInteraction]', error)
      }
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: async () => await queryClient.invalidateQueries([`player-history-${playerEntity}`]),
    onError: (err) => console.error(err),
  })

  const createLocationInteraction = useMutation({
    mutationKey: ['create-location-interaction'],
    mutationFn: async (data: { choiceId: number }) => {
      if (!locationId) throw new Error('No location ID!')
      const { choiceId } = data
      const tx = await worldSend('interactSingle', [locationId, BigNumber.from(choiceId)])
      await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
      return choiceId
    }
  })

  return {
    generateLocationInteraction,
    createLocationInteraction,
  }
}
