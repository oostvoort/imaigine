import { useMUD } from '@/MUDContext'
import { Entity, getComponentValueStrict, HasValue, runQuery } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'
import React from 'react'

export default function useHistory(playerId: Entity) {
  const {
    components: {
      BattleHistoryComponent,
    }
  } = useMUD()

  const battleData = useBattle(playerId)

  /**
   * Queries for battle log entities matching the player and opponent.
   *
   * @param BattleHistoryComponent - The battle log component to query.
   * @param playerId - The player entity ID to match.
   * @param battleData.battle?.opponent - The opponent to match from battle data.
   *
   * Uses a HasValue query to find entities with the BattleHistoryComponent that match
   * the given playerId and opponent.
   *
   * The query result entities are then mapped to extract the component value for each one using
   * getComponentValueStrict.
   *
   * This returns an array of battle log entries for the player against the given opponent.
   */

  const getBattleLogsEntity = runQuery([
    HasValue(BattleHistoryComponent, { player : playerId, opponent: battleData.battleData.battle?.opponent })
  ])

  const getPlayerBattleLogs = Array.from(getBattleLogsEntity).map(
    entity => getComponentValueStrict(BattleHistoryComponent, entity)
  )

  const usePlayerResults = {
    totalWins: battleData.playerInfo.battleResults?.totalWins ?? 0,
    totalLoses: battleData.playerInfo?.battleResults?.totalLoses ?? 0,
  }

  const getBattleResult = {
    isWin: usePlayerResults.totalWins != usePlayerResults.totalLoses ? usePlayerResults.totalWins > usePlayerResults.totalLoses : undefined,
  }

  return {
    getPlayerBattleLogs,
    getBattleResult
  }
}
