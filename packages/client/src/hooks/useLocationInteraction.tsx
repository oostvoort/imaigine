import { useMutation } from 'react-query'
import { SERVER_API } from '@/global/constants'
import {
  GenerateLocationInteraction,
  GenerateLocationInteractionProps,
  GenerateLocationInteractionResponse,
} from '@/global/types'
import { useMUD } from '@/MUDContext'
import { useComponentValue } from "@latticexyz/react"
import { awaitStreamValue } from '@latticexyz/utils'

export default function useLocationInteraction() {

  const {
    components: {
      SingleInteractionComponent,
      MultiInteractionComponent,
    },

    network: {
      worldSend,
      txReduced$,
      playerEntity,
    }
  } = useMUD()

  const locationInteraction = {
    singleInteractionComponent: useComponentValue(SingleInteractionComponent, playerEntity),
    multiInteractionComponent: useComponentValue(MultiInteractionComponent, playerEntity),
  }

  const generateLocationInteraction = useMutation<Awaited<GenerateLocationInteractionResponse>, Error, GenerateLocationInteractionProps>(async (data) => {
    const response = await fetch(`${SERVER_API}/api/v1/interact-single-done`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    return await response.json() as GenerateLocationInteractionResponse
  }, {
    mutationKey: ["generateLocationInteraction"],
  })


  const createLocationInteraction = useMutation<typeof locationInteraction, Error, GenerateLocationInteraction>(async (data) => {
    const { interactableId, choiceId } = data
    const tx = await worldSend('interactSingle', [interactableId, choiceId])
    await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
    return locationInteraction
  })


  return {
    locationInteraction,
    generateLocationInteraction,
    createLocationInteraction
  }
}
