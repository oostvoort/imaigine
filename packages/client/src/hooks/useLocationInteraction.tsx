import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IS_MOCK, SERVER_API } from '@/global/constants'
import {
  GenerateLocationInteractionResponse,
} from '@/global/types'
import { useMUD } from '@/MUDContext'
import { awaitStreamValue } from '@latticexyz/utils'
import { InteractSingleDoneResponse } from '../../../types'
import usePlayer from '@/hooks/usePlayer'
import { BigNumber } from 'ethers'
import useLocation from '@/hooks/v1/useLocation'

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
  const { location } = useLocation(player.location?.value ?? undefined)

  const data = {
    playerEntityId: playerEntity,
    locationEntityId: player.location?.value,
    locationIpfsHash: location.data?.config.value,
    playerIpfsHash: player.config?.value,
  }

  const generateLocationInteraction = useMutation<Awaited<GenerateLocationInteractionResponse>, Error>(async () => {
    const response = await fetch(`${SERVER_API}/api/v1/interact-location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, mock: IS_MOCK}),
    })

    return await response.json() as InteractSingleDoneResponse
  }, {
    mutationKey: ["generateLocationInteraction"],
    onSuccess: () => {
      queryClient.invalidateQueries([`player-history-${playerEntity}`])
    }
  })


  const createLocationInteraction = useMutation<number, Error, {choiceId: number}>(async (data) => {
    if (!locationId) throw new Error('NO LOCATION')
    const { choiceId } = data
    const tx = await worldSend('interactSingle', [locationId, BigNumber.from(choiceId)])
    await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
    return choiceId
  })


  return {
    generateLocationInteraction,
    createLocationInteraction
  }
}
