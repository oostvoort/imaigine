import React from 'react'
import { useMUD } from '@/MUDContext'
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { SETBATTLETYPES } from '@/hooks/minigame/types/battle'
import { useRow } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'

export default function useBattle () {
    const {
      network: {
        worldSend,
        txReduced$,
        storeCache
      }
    } = useMUD()

    const [playerId, setPlayerId] = React.useState<Entity>('0x0000000000000000000000000000000000000000000000000000000000000005' as Entity)
    const [locationId, setLocationId] = React.useState<Entity>('0x0000000000000000000000000000000000000000000000000000000000000002' as Entity)

    const match = {
      battle: useRow(storeCache, {
          table: "BattleComponent",
          key: {
            playerId: playerId as `0x${string}`,
            locationId: locationId as `0x${string}`
          }
      })
    }

    const setMatch = useMutation({
      mutationKey: ["setMatch"],
      mutationFn: async (data: SETBATTLETYPES) => {
        if (match.battle != undefined) return match

        const { playerId, locationId, opponentId } = data
        const tx = await worldSend('setMatch', [playerId, locationId, opponentId])
        await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
        return match
      }
    })

    return {
      playerId,
      locationId,
      setPlayerId,
      setLocationId,
      setMatch,
      match
    }
}
