import React from 'react'
import { useMutation } from '@tanstack/react-query'
import useGame from './useGame'
import { useMUD } from '../MUDContext'
import { hexZeroPad } from 'ethers/lib/utils'
import { useAtom } from 'jotai'
import { triggerRender_atom } from '../atoms/globalAtoms'

export default function useSaveInteraction() {
  const {
    systemCalls,
    network: { playerEntity }
  } = useMUD()
  const {
    player,
    story,
    currentInteraction,
    currentLocation,
  } = useGame()
  const [t, setT] = useAtom(triggerRender_atom)

  return useMutation({
    mutationKey: ['save-interaction'],
    mutationFn: async (variables: any) => {

      await systemCalls.saveInteraction({
        mode: 'interactable',
        storySummary: story.summary.value,
        location: {
          name: currentLocation.name.value,
          summary: currentLocation.summary.value,
        },
        action: variables.text,
        activeEntity: {
          isAlive: player.alive,
          summary: player.summary.value,
          name: player.name.value,
        },
        logHash: currentInteraction.logHash?.value ?? '',
        otherEntities: [
          {
            name: currentInteraction.entity.name,
            summary: currentInteraction.entity.name,
            isAlive: currentInteraction.entity.alive,
          },
          ...currentInteraction.otherParticipants.map(participant => {
            return {
              name: participant.name,
              summary: participant.summary,
              isAlive: participant.alive,
            }
          }),
        ],
      }, String(variables.index), currentInteraction.entity.entity, [ playerEntity, ...currentInteraction.otherParticipants.map(participant => participant.entity) ])
    },
    onSettled: () => {
      setT(prev => prev += 1)
    },
    onSuccess: () => {
      console.log('player successfully travelled')
      setT(prev => prev += 1)
    },
    onError: (error) => {
      console.log(error)
    }
  })
}
