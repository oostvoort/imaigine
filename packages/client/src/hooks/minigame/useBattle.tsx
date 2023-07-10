import { useMUD } from '@/MUDContext'
import { Entity } from '@latticexyz/recs'
import { useComponentValue } from "@latticexyz/react"
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'

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
    battle: useComponentValue(BattleComponent, playerId)
  }

  const setBattle = useMutation({
    mutationKey: ["setBattle"],
    mutationFn: async (options: PromiseOrValue<string>) => {
      const tx = await worldSend('battle', [options])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleData
    }
  })

  return {
    battleData,
    setBattle
  }
}
