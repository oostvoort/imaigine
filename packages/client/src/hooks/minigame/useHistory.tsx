import React from 'react'
import { useMUD } from '@/MUDContext'
import { Entity, getComponentValueStrict, HasValue, runQuery } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'
import { parsePlayerConfig } from '@/global/utils'
import { useQueries, useQuery } from '@tanstack/react-query'

export default function useHistory(playerId: Entity) {
  const {
    components: {
      BattleHistoryComponent,
      ConfigComponent,
    }
  } = useMUD()

  const battleData = useBattle(playerId)


  /**
   * getBattleLogsEntity queries for entities with the BattleHistoryComponent
   * that match the provided playerId and opponent.
   *
   * @param {Entity} playerId - The player entity to query for.
   * @param {Entity} battleData.battleData.battle?.opponent - The opponent entity to query for.
   *
   * @returns {Entity[]} An array of entities with matching BattleHistoryComponents.
   */

  const getBattleLogsPlayerEntity = runQuery([
    HasValue(BattleHistoryComponent, { player : playerId, opponent: battleData.battleData.battle?.opponent }),
  ])

  const getBattleLogsOpponentEntity = runQuery([
    HasValue(BattleHistoryComponent, { player : battleData.battleData.battle?.opponent, opponent: playerId })
  ])

  const getBattleLogs = Array.from(getBattleLogsPlayerEntity).concat(Array.from(getBattleLogsOpponentEntity))

  /**
   * getPlayerBattleLogs maps the entities returned by getBattleLogsEntity to the
   * BattleHistoryComponent value for each entity.
   *
   * @param {Entity[]} getBattleLogsEntity - Array of entities from previous query.
   *
   * @returns {BattleHistoryComponent[]} Extracted BattleHistoryComponent values.
   */
  const getPlayerBattleLogs = getBattleLogs.map(
    entity => getComponentValueStrict(BattleHistoryComponent, entity)
  )

  /**
   * getWinnerInfo runs async queries to get winner info for each battle log.
   *
   * The map callback does the following:
   * - Gets ConfigComponent for winner entity
   * - Parses player config value
   * - Returns winnerInfo, isDraw flag, winnerOption
   *
   * @param {BattleHistoryComponent[]} getPlayerBattleLogs - Battle logs to get winner info for.
   *
   * @returns {Promise[]} Winner info promises for each battle log.
   */
  const getWinnerInfo = useQueries({
    queries: getPlayerBattleLogs.map((data, index) => {
      return {
        queryKey: ['winner-info', index],
        queryFn: async () => {
          const winner = await parsePlayerConfig(getComponentValueStrict(ConfigComponent, data?.winner as Entity)?.value as string)
          return {
            isWin: data?.winner === playerId,
            playerId: data?.player,
            winnerId: data?.winner,
            winnerInfo: winner,
            isDraw: data?.draw,
            winnerOption: data?.winnerOption
          }
        }
      }
    })
  })


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
    getWinnerInfo
  }
}
