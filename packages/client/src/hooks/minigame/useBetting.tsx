import { useMUD } from '@/MUDContext'
import React from 'react'
import { utils } from 'ethers'
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import useBattle from '@/hooks/minigame/useBattle'
import { SETBETTINGTYPES } from '@/hooks/minigame/types/betting'
import { useAtom } from 'jotai'
import { hash_options_set_value } from '@/states/minigame'

const ZEROHEX = "0x0000000000000000000000000000000000000000000000000000000000000000"

export default function useBetting () {
  const {
    network: {
      worldSend,
      txReduced$
    }
  } = useMUD()

  const [hashOptions, setHashOptions] = React.useState<string>()

  const { match } = useBattle()
  const [, setHashToAtom] = useAtom(hash_options_set_value)

  /**
   * Called when betting options are clicked.
   * Generates a hash from the selected betting option and sets it in state.
   *
   * @param options - The selected betting option.
   */
  const OnClickOptions = (options: string) => {

    const key = utils.keccak256(utils.toUtf8Bytes("SECRET_KEY"));
    const data = utils.keccak256(utils.toUtf8Bytes(options))
    const timestamp = new Date().getTime()

    setHashToAtom({ key, data, timestamp })
    setHashOptions(utils.solidityKeccak256(['bytes32', 'bytes32', 'uint64'], [key, data, timestamp]))
  }

  /**
   * Mutation to set a player's betting option for a battle.
   * @param mutationKey - The key for the mutation, ["setBetting"].
   * @param mutationFn - The async function to execute the mutation.
   * @param data - The data for the mutation, containing the player ID and location ID.
   * @throws Error if the hash options, player ID, or location ID are undefined.
   * @returns The match object containing the updated battle component data.
   */
  const setBetting = useMutation({
    mutationKey: ["setBetting"],
    mutationFn: async (data: SETBETTINGTYPES) => {
      if (match.battle?.value.option != ZEROHEX && hashOptions == undefined) return match

      const { playerId, locationId } = data
      if (hashOptions == undefined) throw new Error("Required Hash Options")
      if (playerId == undefined) throw new Error("Required Player Value")
      if (locationId == undefined) throw new Error("Required Location Value")

      const tx = await worldSend('setBetting', [playerId, locationId, hashOptions])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return match
  }})

  return {
    hashOptions,
    OnClickOptions,
    setBetting
  }
}
