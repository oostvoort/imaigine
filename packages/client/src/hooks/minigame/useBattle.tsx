import { useMUD } from '@/MUDContext'
import { Entity } from '@latticexyz/recs'
import { useComponentValue } from "@latticexyz/react"
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'
import { LOCKINTYPES } from '@/hooks/minigame/types/battle'

export default function useBattle(playerId: Entity) {
  const {
    components: {
      BattleComponent,
    },
    network: {
      worldSend,
      txReduced$
    }
  } = useMUD()

  const battleData = {
    battle: useComponentValue(BattleComponent, playerId),
  }

  const setBattle = useMutation({
    mutationKey: ["setBattle"],
    mutationFn: async (options: PromiseOrValue<string>) => {

      if (options == undefined) throw new Error("Requested options is empty")

      const tx = await worldSend('battle', [options])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleData
    }
  })

  const lockIn = useMutation({
    mutationKey: ["lockIn"],
    mutationFn: async (data: LOCKINTYPES) => {
      const { hashSalt, options } = data

      if (hashSalt == undefined) throw new Error ("Requested hashSalt is undefined")
      if (options == undefined) throw new Error ("Requested options is undefined")

      const tx = await worldSend('lockIn', [hashSalt, options])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleData
    }
  })

  return {
    battleData,
    setBattle,
    lockIn
  }
}
