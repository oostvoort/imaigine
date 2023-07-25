import { useMutation, useQuery } from '@tanstack/react-query'
import { useMUD } from '@/MUDContext'
import { awaitStreamValue } from '@latticexyz/utils'
import { useComponentValue } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'

/**
  * Hook for initiating a play action in a location.
  * @param locationId The ID of the location to play in.
  * @returns The playdata and a play mutation function.
 */
export default function usePlay(locationId: Entity) {

    const {
    components: {
      BattleQueueComponent,
    },
    network: {
      worldSend,
      txReduced$,
      playerEntity
    }
  } = useMUD()

    const playdata = {
      playerInQueue: useComponentValue(BattleQueueComponent, locationId),
  }

    /**
     * Defines a mutation hook to play in a location.
     * @param mutationKey The key for the mutation.
     * @param mutationFn The function to execute the mutation.
     * Checks if the opponent player ID is the same as the player entity. If so, returns the playdata.
     * Sends a transaction to play in the location.
     * Waits for the transaction to be confirmed.
     * Returns the playdata.
     */
    const play = useMutation({
    mutationKey: ["play"],
    mutationFn: async () => {
      if (playdata.playerInQueue?.playerId === playerEntity) return playdata

      const tx = await worldSend('play', [])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return playdata
    }
  })

    return {
    playdata,
    play,
  }
}
