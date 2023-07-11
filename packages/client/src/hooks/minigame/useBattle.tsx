import { useMUD } from '@/MUDContext'
import { Entity, Type } from '@latticexyz/recs'
import { useComponentValue } from "@latticexyz/react"
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { PromiseOrValue } from 'contracts/types/ethers-contracts/common'
import { LOCKINTYPES } from '@/hooks/minigame/types/battle'
import { useState } from 'react'
import { utils } from 'ethers'
import { useAtom } from 'jotai'
import { hash_options_set_value } from '@/states/minigame'

export default function useBattle(playerId: Entity) {
  const {
    components: {
      BattleComponent,
      BattlePointsComponent,
      PlayerComponent,
      ConfigComponent,
      ImageComponent,
      LocationComponent
    },
    network: {
      worldSend,
      txReduced$,
    }
  } = useMUD()

  const DEFAULT_BATTLE_POINTS = BigInt("0")

  const [, setHashAtom] = useAtom(hash_options_set_value)

  const [battleOption, setBattleOption] = useState<PromiseOrValue<string>>("NONE")

  const battleData = {
    battle: useComponentValue(BattleComponent, playerId),
  }

  const playerInfo = {
    id: playerId,
    player: useComponentValue(PlayerComponent, playerId),
    config: useComponentValue(ConfigComponent, playerId),
    image: useComponentValue(ImageComponent, playerId),
    location: useComponentValue(LocationComponent, playerId),
    battlePoints: useComponentValue(BattlePointsComponent, playerId)
  }

  const opponentInfo = {
    id: battleData.battle?.opponent,
    player: useComponentValue(PlayerComponent, battleData.battle?.opponent as Entity),
    config: useComponentValue(ConfigComponent, battleData.battle?.opponent as Entity),
    image: useComponentValue(ImageComponent, battleData.battle?.opponent as Entity),
    location: useComponentValue(LocationComponent, battleData.battle?.opponent as Entity),
    battlePoints: useComponentValue(BattlePointsComponent, battleData.battle?.opponent as Entity)
  }

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
  const onSelectOptions = (options: string) => {
    const key = utils.keccak256(utils.toUtf8Bytes("SECRET_ID"))
    const data = utils.keccak256(utils.toUtf8Bytes(options))
    const timestamp = new Date().getTime()

    const hashOptions = utils.solidityKeccak256(["string", "uint256"], [String(key + timestamp), data])

    setBattleOption(hashOptions)
    setHashAtom({ key, data, timestamp })
  }

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
   * @param data An object containing the hashSalt and options to lock in.
   * @param hashSalt The hash salt corresponding to the selected options.
   * @param options The selected battle options.
   * @throws Error if hashSalt or options are undefined.
   * Sends a transaction to lock in the battle options.
   * Waits for the transaction to be confirmed.
   * Returns the battle data.
   */
  const lockIn = useMutation({
    mutationKey: ["lockIn"],
    mutationFn: async (data: LOCKINTYPES) => {
      const { hashSalt, options } = data

      if (hashSalt == undefined) throw new Error ("Requested hashSalt is undefined")
      if (options == undefined) throw new Error ("Requested options is undefined")

      const tx = await worldSend('lockIn', [hashSalt, options])
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
    opponentInfo
  }
}
