import { useMUD } from '@/MUDContext'
import { ComponentValue, Entity } from '@latticexyz/recs'
import { useComponentValue } from '@latticexyz/react'
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'
import { useState } from 'react'
import { utils } from 'ethers'
import { useAtom } from 'jotai'
import { hash_options_set_value, hash_options_value } from '@/states/minigame'
import { BattleOptions, HashOptionsTypes } from '@/hooks/minigame/types/battle'

export default function useBattle(playerId: Entity) {
  const {
    components: {
      BattleComponent,
      BattlePointsComponent,
      PlayerComponent,
      ConfigComponent,
      ImageComponent,
      LocationComponent,
      BattleResultsComponents
    },
    network: {
      worldSend,
      txReduced$,
    }
  } = useMUD()

  const DEFAULT_BATTLE_POINTS: unknown = "0"

  const [, setHashAtom] = useAtom(hash_options_set_value)
  const [hashAtom] = useAtom<HashOptionsTypes>(hash_options_value)

  const [battleOption, setBattleOption] = useState<PromiseOrValue<string>>("NONE")

  const battleData = {
    battle: useComponentValue(BattleComponent, playerId),
  }

  const opponentBattleData = {
    battle: useComponentValue(BattleComponent, battleData.battle?.opponent as Entity),
  }

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
      battleResults: useComponentValue(BattleResultsComponents, playerId)
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
  const onSelectOptions = async (options: BattleOptions) => {
    const key = utils.keccak256(utils.toUtf8Bytes("SECRET_ID"))
    const timestamp = new Date().getTime()
    const data = options

    const hashOptions = utils.solidityKeccak256(["string", "uint8"], [String(key + timestamp), data])

    setBattleOption(hashOptions)
    setHashAtom({ key, data, timestamp })

    await setBattle.mutateAsync()
  }

  /**
   * Defines a mutation hook to set battle lock.
   * @param mutationKey The key for the mutation.
   * @param mutationFn The function to execute the mutation.
   * Sends a transaction to set lock in the battle options
   * Waits for the transaction to be confirmed.
   * Returns the battle data.
   * */
  const setLockBattle = useMutation({
    mutationKey: ["setLockBattle"],
    mutationFn: async () => {
      const tx = await worldSend('battleLock', [])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleData
    }
  })

  /**
   * Defines a mutation hook to set the battle pre-result.
   *
   * @param mutationKey - The key for the mutation.
   * @param mutationFn - The async function to execute the mutation.
   *
   * The mutation function:
   * - Gets the selected battle options data from the hashAtom state.
   * - Throws error if no data.
   * - Sends a transaction to set the pre-result with the options data.
   * - Waits for the transaction to be confirmed.
   * - Returns the battle data.
   */
  const setBattlePreResult = useMutation({
    mutationKey: ["preResult"],
    mutationFn: async () => {

      const { data } = hashAtom
      if (data == undefined) throw new Error("Requested options is empty")

      const tx = await worldSend('preResult', [data])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleData
    }
  })

  /**
   * Defines a mutation hook to set battle options.
   * @throws Error if battleOption is undefined.
   * Sends a transaction with the battle options.
   * Waits for the transaction to be confirmed.
   * Returns the battle data.
   */
  const setBattle = useMutation({
    mutationKey: ["setBattle"],
    mutationFn: async () => {

      if (battleOption == undefined) throw new Error("Requested options is empty")

      const tx = await worldSend('battle', [battleOption])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleData
    }
  })

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
    mutationKey: ["lockIn"],
    mutationFn: async () => {
      const { key, data, timestamp } = hashAtom

      if (key == undefined || (data == undefined || data == BattleOptions.NONE) || timestamp == undefined) throw new Error("Requested options is empty")

      const tx = await worldSend('lockIn', [String(key + timestamp), data])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleData
    }
  })

  return {
    battleData,
    setBattle,
    lockIn,
    onSelectOptions,
    playerInfo,
    opponentInfo,
    setLockBattle,
    opponentBattleData,
    setBattlePreResult
  }
}
