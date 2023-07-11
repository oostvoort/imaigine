import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { useMUD } from '@/MUDContext'
import { Entity } from '@latticexyz/recs'
import usePlay from '@/hooks/minigame/usePlay'

export default function useLeave(locationId: Entity) {

  const {
    network: {
      worldSend,
      txReduced$
    },
  } = useMUD()

  const { playdata } = usePlay(locationId)

  const leave = useMutation({
    mutationKey: ["leave"],
    mutationFn: async () => {
      const tx = await worldSend('leave', [])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return playdata
    }
  })

  return {
    leave
  }
}
