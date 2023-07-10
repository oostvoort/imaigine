import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { useMUD } from '@/MUDContext'
import { Entity } from '@latticexyz/recs'

export default function useLeave() {

  const {
    network: {
      worldSend,
      txReduced$
    },
  } = useMUD()

  const leave = useMutation({
    mutationKey: ["leave"],
    mutationFn: async () => {
      const tx = await worldSend('leave', [])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return true
    }
  })

  return {
    leave
  }
}
