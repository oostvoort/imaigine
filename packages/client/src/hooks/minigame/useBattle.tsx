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

    const [playerId, setPlayerId] = React.useState<Entity>()
    const [locationId, setLocationId] = React.useState<Entity>()

  /**
   * Object containing the battle component data for a player's match.
   * @param storeCache - The cache containing the battle component data.
   * @param table - The table name to query, "BattleComponent".
   * @param key - The key to query the table with, containing the player ID and location ID.
   */
    const match = {
      battle: useRow(storeCache, {
          table: "BattleComponent",
          key: {
            playerId: playerId as `0x${string}`,
            locationId: locationId as `0x${string}`
          }
      })
    }

  /**
   * Mutation to set up a battle match between two players.
   * @param mutationKey - The key for the mutation, ["setMatch"].
   * @param mutationFn - The async function to execute the mutation.
   * @param data - The data for the mutation, containing the opponent ID.
   * @throws Error if the player ID or location ID is undefined.
   * @returns The match object containing the battle component data for the player in the match.
   */
    const setMatch = useMutation({
      mutationKey: ["setMatch"],
      mutationFn: async (data: SETBATTLETYPES) => {
        if (match.battle != undefined) return match

        if (playerId == undefined) throw new Error("Required Player Entity: `setPlayerId(\"0x00\")`")
        if (locationId == undefined) throw new Error("Required Location Entity: `setLocationId(\"0x00\")`")

        const { opponentId } = data
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
