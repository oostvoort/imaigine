import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { useMUD } from '@/MUDContext'
import { Entity } from '@latticexyz/recs'
import usePlay from '@/hooks/minigame/usePlay'
import useHistory from '@/hooks/minigame/useHistory'
import usePlayer from '@/hooks/v1/usePlayer'

export default function useLeave(locationId: Entity) {

  const {
    network: {
      worldSend,
      txReduced$,
    },
  } = useMUD()

  const { playdata } = usePlay(locationId)
  const { player } = usePlayer()
  const { getBattleLogs} = useHistory(player.id as Entity)
  /**
   * Defines a mutation hook to leave a location.
   * @param mutationKey The key for the mutation.
   * @param mutationFn The function to execute the mutation.
   * Sends a transaction to leave the location.
   * Waits for the transaction to be confirmed.
   * Returns the playdata.
   */
  const leave = useMutation({
    mutationKey: [ 'leave' ],
    mutationFn: async () => {
      const tx = await worldSend('leave', [getBattleLogs])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return playdata
    }
  })

  return {
    leave
  }
}
