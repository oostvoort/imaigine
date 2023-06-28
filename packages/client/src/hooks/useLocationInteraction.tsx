import { useMutation } from 'react-query'
import { SERVER_API } from '@/global/constants'
import {
  GenerateLocationInteractionResponse,
} from '@/global/types'
import { useMUD } from '@/MUDContext'
import { awaitStreamValue } from '@latticexyz/utils'
import { InteractLocationProps, InteractSingleDoneResponse } from '../../../types'
import usePlayer from '@/hooks/usePlayer'

export default function useLocationInteraction() {

  const {

    network: {
      worldSend,
      txReduced$,
    }
  } = useMUD()

  const { player } = usePlayer()

  const locationId = player.location?.value

  const generateLocationInteraction = useMutation<Awaited<GenerateLocationInteractionResponse>, Error, InteractLocationProps>(async (data) => {
    const response = await fetch(`${SERVER_API}/api/v1/interact-location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    return await response.json() as InteractSingleDoneResponse
  }, {
    mutationKey: ["generateLocationInteraction"],
  })


  const createLocationInteraction = useMutation<number, Error, {choiceId: number}>(async (data) => {
    if (!locationId) throw new Error('NO LOCATION')
    const { choiceId } = data
    const tx = await worldSend('interactSingle', [locationId, choiceId])
    await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
    return choiceId
  })


  return {
    generateLocationInteraction,
    createLocationInteraction
  }
}
