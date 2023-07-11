import { useMutation } from '@tanstack/react-query'
import { useMUD } from '@/MUDContext'
import { awaitStreamValue } from '@latticexyz/utils'
import { useComponentValue } from "@latticexyz/react"
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
    opponent: useComponentValue(BattleQueueComponent, locationId)
  }

    const play = useMutation({
    mutationKey: ["play"],
    mutationFn: async () => {
      if (playdata.opponent?.playerId === playerEntity) return playdata

      const tx = await worldSend('play', [])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return playdata
    }
  })

    return {
    playdata,
    play
  }
}
