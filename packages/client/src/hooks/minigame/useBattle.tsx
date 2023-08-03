import { useMUD } from '@/MUDContext'
import { ComponentValue, Entity } from '@latticexyz/recs'
import { useComponentValue } from '@latticexyz/react'
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { BATTLE_OPTIONS } from '@/hooks/minigame/types/battle'
import { extractErrorMessage } from '@/global/utils'
import { toast } from 'react-toastify'

export default function useBattle(playerId: Entity) {
  const {
    components: {
      BattleComponent,
      BattlePointsComponent,
      PlayerComponent,
      ConfigComponent,
      ImageComponent,
      LocationComponent,
      BattleResultsComponents,
      BattlePreResultsComponents,
    },
    network: {
      worldSend,
      txReduced$,
      worldContract,
    },
  } = useMUD()

  const DEFAULT_BATTLE_POINTS: unknown = '0'

  /**
   * Generates a hash of the selected battle options.
   * @param options The selected battle options.
   * Generates a key hash from the string "SECRET_ID".
   * Generates a data hash from the selected options.
   * Gets the current timestamp.
   * Generates a hash of the key, data and timestamp using solidityKeccak256.
   * Sets the battleOption state to the generated hash.
   * Sets the hash_options_set_value atom to an object containing the key, data and timestamp.
   */
  const onSelectOptions = async (options: BATTLE_OPTIONS) => {
    const hashedSalt = await worldContract.encodeHash(options, '123')

    const tx = await worldSend('onSelect', [ hashedSalt ])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
  }

  /**
   * Defines a mutation hook to lock in battle options.
   * @param mutationKey The key for the mutation.
   * @param mutationFn The function to execute the mutation.
   * @throws Error if hashSalt or options are undefined.
   * Gets the key, data and timestamp from the hash_options_value atom.
   * Checks that key, data and timestamp are defined.
   * Sends a transaction to lock in the battle options with the key, timestamp and options.
   * Waits for the transaction to be confirmed.
   * Returns the battle data.
   */
  const lockIn = useMutation({
    mutationKey: [ 'lockIn' ],
    mutationFn: async (options: BATTLE_OPTIONS) => {
      const tx = await worldSend('reveal', [ options, '123' ])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    },
    onError: (err) => {
      toast(`Error on lockin Fn: ${extractErrorMessage(err)}`, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
      console.error(extractErrorMessage(err))
    },
  })

  /**
   * Defines a mutation hook to rematch in battle.
   * @param mutationKey The key for the mutation.
   * @param mutationFn The function to execute the mutation.
   * Sends a transaction to rematch in the battle.
   * Waits for the transaction to be confirmed.
   * Returns the battle data.
   */
  const rematch = useMutation({
    mutationKey: [ 'rematch' ],
    mutationFn: async () => {
      const tx = await worldSend('rematch', [])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    },
    onError: (err) => {
      toast(`Error on rematch Fn: ${extractErrorMessage(err)}`)
      console.error(extractErrorMessage(err))
    },
  })

  const validateBattle = useMutation({
    mutationKey: [ 'validateBattle' ],
    mutationFn: async () => {
      const tx = await worldSend('validateBattle', [])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    },
    onError: (err) => {
      toast(`Error on validate battle Fn: ${extractErrorMessage(err)}`)
      console.error(extractErrorMessage(err))
    },
  })

  /**
   * Custom hook to get battle data for a player.
   *
   * @param playerId - ID of the player to get battle data for
   *
   * Calls useComponentValue to get latest battle data from BattleComponent.
   *
   * Returns object containing the battle data.
   *
   * Memoized to avoid duplicate requests.
   */
  const useBattleData = (playerId: Entity) => {
    return {
      battle: useComponentValue(BattleComponent, playerId),
      battlePreResults: useComponentValue(BattlePreResultsComponents, playerId)
    }
  }

  /**
   * Get battle data for current player and opponent.
   *
   * Calls useBattleData hook to get data for:
   * - Current player ID
   * - Opponent ID from player's battle data
   *
   * Returns battleData and opponentBattleData objects.
   */
  const battleData = useBattleData(playerId)
  const opponentBattleData  = useBattleData(battleData.battle?.opponent as Entity)

  /**
   * Custom hook to get player data.
   *
   * @param playerId - ID of the player to get data for
   *
   * Calls useComponentValue to get latest data for:
   * - PlayerComponent
   * - ConfigComponent
   * - ImageComponent
   * - LocationComponent
   * - BattlePointsComponent
   * - BattleResultsComponents
   *
   * Returns object containing player data.
   *
   * Memoized to avoid duplicate requests.
   */
  const usePlayerData = (playerId: Entity) => {
    // Memoization and caching
    return {
      id: playerId,
      player: useComponentValue(PlayerComponent, playerId),
      config: useComponentValue(ConfigComponent, playerId),
      image: useComponentValue(ImageComponent, playerId),
      location: useComponentValue(LocationComponent, playerId),
      battlePoints: useComponentValue(BattlePointsComponent, playerId, DEFAULT_BATTLE_POINTS as ComponentValue),
      battleResults: useComponentValue(BattleResultsComponents, playerId),
    }
  }

  /**
   * Get player and opponent data for current battle.
   *
   * Calls usePlayerData hook to get data for:
   * - Current player ID
   * - Opponent ID from battleData
   *
   * Returns playerInfo and opponentInfo objects.
   */
  const playerInfo = usePlayerData(playerId)
  const opponentInfo =  usePlayerData(battleData.battle?.opponent as Entity)

  return {
    battleData,
    opponentBattleData,
    playerInfo,
    opponentInfo,
    lockIn,
    rematch,
    onSelectOptions,
    validateBattle,
  }
}
