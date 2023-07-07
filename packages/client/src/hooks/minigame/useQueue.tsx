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

  /**
   * Object containing the player ID currently in the battle queue for the location.
   * @param BattleQueueComponent - The BattleQueueComponent to get the player ID from.
   * @param locationEntity - The location entity to get the battle queue for.
   */
  const battleQueue = {
    playerId: useComponentValue(BattleQueueComponent, locationEntity)
  }

  /**
   * Mutation to set a player in the queue for a battle at a location.
   * @param mutationKey - The key for the mutation, ["setQueue"].
   * @param mutationFn - The async function to execute the mutation.
   * @param data - The data for the mutation, containing the player ID and location ID.
   * @throws Error if the location entity is undefined.
   * @returns The updated battleQueue state.
   */
  const setQueue = useMutation({
    mutationKey: ["setQueue"],
    mutationFn: async (data: SETQUEUETYPES) => {
      if (battleQueue.playerId) return battleQueue

      if (locationEntity == undefined) throw new Error("Required Location Entity: `setLocationEntity(\"0x00\")`")

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
