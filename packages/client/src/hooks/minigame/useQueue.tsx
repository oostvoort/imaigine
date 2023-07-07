import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { useMUD } from '@/MUDContext'
import { useComponentValue } from '@latticexyz/react'
import { SETQUEUETYPES } from '@/hooks/minigame/types/queue'
import { Entity } from '@latticexyz/recs'
import React from 'react'

export default function useQueue () {
  const [locationEntity, setLocationEntity] = React.useState<Entity>()
  const {
    components: {
      BattleQueueComponent
    },
    network: {
      txReduced$,
      worldSend
    }
  } = useMUD()

  const battleQueue = {
    playerId: useComponentValue(BattleQueueComponent, locationEntity)
  }

  const setQueue = useMutation({
    mutationKey: ["setQueue"],
    mutationFn: async (data: SETQUEUETYPES) => {
      if (battleQueue.playerId) return battleQueue

      const { playerId, locationId } = data
      const tx = await worldSend('setQueue', [playerId, locationId])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleQueue
    }
  })

  return {
    setLocationEntity,
    battleQueue,
    setQueue
  }
}
