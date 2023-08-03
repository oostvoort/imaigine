import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { useMUD } from '@/MUDContext'
import { Entity } from '@latticexyz/recs'
import usePlay from '@/hooks/minigame/usePlay'
import useHistory from '@/hooks/minigame/useHistory'
import usePlayer from '@/hooks/v1/usePlayer'
import { useSetAtom } from 'jotai'
import { activeScreen_atom, SCREENS } from '@/states/global'

export default function useLeave(locationId: Entity) {

  const {
    network: {
      worldSend,
      txReduced$,
    },
  } = useMUD()

  const setActiveScreen = useSetAtom(activeScreen_atom)

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
      const tx = await worldSend('leave', [])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    },
    onSuccess: () => {
      setActiveScreen(SCREENS.CURRENT_LOCATION)
    }
  })

  return {
    leave
  }
}
