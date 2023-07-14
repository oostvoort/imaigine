import React from 'react'
import { useMUD } from '@/MUDContext'
import { Entity, getComponentValueStrict, HasValue, runQuery } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'
import { parsePlayerConfig } from '@/global/utils'
import { useQuery } from '@tanstack/react-query'

export default function useHistory(playerId: Entity) {
  const {
    components: {
      BattleHistoryComponent,
      ConfigComponent,
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

  // const getBattleLogsEntity = runQuery([
  //   HasValue(BattleHistoryComponent, { player : playerId, opponent: battleData.battleData.battle?.opponent })
  // ])

  // const getPlayerBattleLogs = Array.from(getBattleLogsEntity).map(
  //   entity => getComponentValueStrict(BattleHistoryComponent, entity)
  // )

  // useQuery
  // const getWinnerInfo = useQuery({
  //   queryKey: ['winner-info-new'],
  //   queryFn: async () => {
  //     if (!getPlayerBattleLogs) throw new Error('!!!')
  //
  //     const winners: any = []
  //
  //     getPlayerBattleLogs.map(async data => {
  //       const winner = await parsePlayerConfig(getComponentValueStrict(ConfigComponent, data?.winner as Entity)?.value as string)
  //       console.log({ winner, data })
  //       winners.push({
  //         winnerInfo: winner,
  //         isDraw: data?.draw,
  //         winnerOption: data?.winnerOption,
  //       })
  //     })
  //
  //     console.log({ x: JSON.stringify(winners) })
  //     return winners
  //   },
  //   enabled: Boolean(getPlayerBattleLogs)
  // })



  /**
   * Gets player battle results and determines if it was a win.
   *
   * @param battleData.playerInfo.battleResults?.totalWins - The total wins for the player.
   * @param battleData.playerInfo.battleResults?.totalLoses - The total loses for the player.
   *
   * usePlayerResults extracts the total wins and loses for the player from the battleData.
   *
   * getBattleResult then checks if total wins is greater than loses to determine if it was a win.
   * If wins and loses are equal, isWin is set to undefined.
   *
   * This allows determining if the battle was a win for the player based on their results data.
   */

  const usePlayerResults = {
    totalWins: battleData.playerInfo.battleResults?.totalWins ?? 0,
    totalLoses: battleData.playerInfo?.battleResults?.totalLoses ?? 0,
  }

  const getBattleResult = {
    isWin: usePlayerResults.totalWins != usePlayerResults.totalLoses ? usePlayerResults.totalWins > usePlayerResults.totalLoses : 'Draw',
  }

  return {
    getBattleResult,
    // getWinnerInfo
  }
}
