import { useMUD } from '@/MUDContext'
import { Entity, getComponentValueStrict, Has, HasValue, runQuery } from '@latticexyz/recs'
import useBattle from '@/hooks/minigame/useBattle'
import { parsePlayerConfig } from '@/global/utils'
import { useQueries } from '@tanstack/react-query'

export default function useHistory(playerId: Entity) {
  const {
    components: {
      BattleHistoryComponent,
      ConfigComponent,
      BattlePointsComponent
    }
  } = useMUD()

  const battleData = useBattle(playerId)

  /**
   * Queries for all entities that have the BattlePointsComponent.
   *
   * getAllPlayersBattlePointsEntity returns all entities with BattlePointsComponent.
   *
   * getAllPlayersBattlePoints maps the entities to async queries that:
   * - Get the ConfigComponent value
   * - Parse the player config
   * - Return player ID, BattlePointsComponent value, and parsed config
   *
   * @returns {Promise[]} An array of promises that resolve to player battle points info.
   */

  const getAllPlayersBattlePointsEntity = runQuery([
    Has(BattlePointsComponent)
  ])

  const getAllPlayersBattlePoints = useQueries({
    queries: Array.from(getAllPlayersBattlePointsEntity).map((entity) => {
      return {
        queryKey: ["getAllPlayersBattlePoints", entity],
        queryFn: async () => {
          const playerInfo = await parsePlayerConfig(getComponentValueStrict(ConfigComponent, entity as Entity)?.value as string)

          return {
            playerID: entity,
            playerBP: getComponentValueStrict(BattlePointsComponent, entity as Entity),
            playerInfo: playerInfo
          }
        }
      }
    })
  })

  /**
   * Queries for battle log entities matching the player and opponent.
   *
   * @param playerId - The player entity to query for
   * @param battleData.battleData.battle?.opponent - The opponent entity to query for
   *
   * getBattleLogsPlayerEntity queries for logs where playerId is the player.
   *
   * getBattleLogsOpponentEntity queries for logs where playerId is the opponent.
   *
   * getBattleLogs concatenates the results into one array.
   *
   * Sorts the combined array.
   */

  const getBattleLogsPlayerEntity = runQuery([
    HasValue(BattleHistoryComponent, { player : playerId, opponent: battleData.battleData.battle?.opponent }),
  ])

  const getBattleLogsOpponentEntity = runQuery([
    HasValue(BattleHistoryComponent, { player : battleData.battleData.battle?.opponent, opponent: playerId })
  ])

  const getBattleLogs = Array.from(getBattleLogsPlayerEntity).concat(Array.from(getBattleLogsOpponentEntity))

  getBattleLogs.sort();

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
    totalWins: battleData.playerInfo.battleResults?.totalWins ?? null,
    totalLoses: battleData.playerInfo?.battleResults?.totalLoses ?? null,
  }

  const getBattleResult = {
    isWin: (usePlayerResults.totalWins != null || usePlayerResults.totalLoses != null)
      && ((usePlayerResults.totalWins != null && usePlayerResults.totalLoses != null) && usePlayerResults.totalWins > usePlayerResults.totalLoses)
      ? true
      : (usePlayerResults.totalLoses == null && usePlayerResults.totalLoses == null)
      ? (usePlayerResults.totalWins == 0 && usePlayerResults.totalLoses == 0)
      : false,
    isDraw: (usePlayerResults.totalWins != null && usePlayerResults.totalLoses != null)
      && usePlayerResults.totalLoses === usePlayerResults.totalWins ? true : undefined,
  }

  return {
    getBattleResult,
    getWinnerInfo,
    getAllPlayersBattlePoints,
    getBattleLogs,
  }
}
