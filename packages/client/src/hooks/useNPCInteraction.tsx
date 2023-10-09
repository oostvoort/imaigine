import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { IS_MOCK, SERVER_API } from '@/global/constants'
import { shuffleArray } from '@/global/utils'
import { useMUD } from '@/MUDContext'
import { InteractNpcProps, InteractNpcResponse } from '../../../types'
import { BigNumber } from 'ethers'
import { awaitStreamValue } from '@latticexyz/utils'

export default function useNPCInteraction() {
  const {
    components: {
      MultiInteractionComponent
    },
    network: {
      worldContract,
      txReduced$,
      worldSend,
    },
  } = useMUD();

  const interactNPC = useMutation({
    mutationKey: [ 'interact-npc' ],
    mutationFn: async (variables: InteractNpcProps) => {
      try {
        const response = await fetch(`${SERVER_API}/api/v1/interact-npc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...variables, mock: IS_MOCK }),
        })

        const data = await response.json()

        return {
          conversationHistory: data.conversationHistory,
          option: data.option,
        } as InteractNpcResponse
      } catch (error) {
        console.error('[interactNPC]', error)
      }
    },
    retry: 5,
    retryDelay: 1000,
    onError: (err) => {
      console.error(err)
    },
  })

  const createNPCInteraction = useMutation<any, Error, {choiceId: number, npcId: string}>(async (data) => {
    const { choiceId, npcId } = data
    const tx = await worldSend('interactMulti', [npcId, BigNumber.from(`${choiceId}`)])
    await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
    return worldContract.winningChoice(npcId)
  })

  return { interactNPC, createNPCInteraction }
}
