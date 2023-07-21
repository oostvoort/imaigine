import { Entity } from '@latticexyz/recs'
import { useMUD } from '@/MUDContext'
import useBattle from '@/hooks/minigame/useBattle'
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { useComponentValue } from '@latticexyz/react'

export default function useBattleTime(playerId: Entity) {
  const {
    components: {
      BattleRoundTimeComponent,
    },
    network: {
      worldSend,
      txReduced$,
    }
  } = useMUD()

  const { opponentInfo} = useBattle(playerId)

  const countTime = {
    time: useComponentValue(BattleRoundTimeComponent, playerId)
  }

  const startBattleRound = useMutation({
    mutationKey: ["startBattleRound"],
    mutationFn: async () => {
      const tx = await worldSend("startBattleRoundTime", [opponentInfo.id])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)

      return countTime
    }
  })

  const updateBattleRound = useMutation({
    mutationKey : ["updateBattleRound"],
    mutationFn : async (seconds: number) => {
        const tx = await worldSend("updateBattleRoundTime", [opponentInfo.id, seconds])
        await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)

        return countTime
    }
  })

  return {
    countTime,
    startBattleRound,
    updateBattleRound
  }
}
