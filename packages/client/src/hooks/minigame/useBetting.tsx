import { useMUD } from '@/MUDContext'
import React from 'react'
import { utils } from 'ethers'
import { useMutation } from '@tanstack/react-query'
import { awaitStreamValue } from '@latticexyz/utils'
import { SETBETTINGTYPES } from '@/hooks/minigame/types/betting'
import useBattle from '@/hooks/minigame/useBattle'

export default function useBetting () {
  const {
    network: {
      worldSend,
      txReduced$
    }
  } = useMUD()

  const [playerId, setPlayerId] = React.useState<string>('0x0000000000000000000000000000000000000000000000000000000000000005')
  const [locationId, setLocationId] = React.useState<string>('0x0000000000000000000000000000000000000000000000000000000000000002')
  const [hashOptions, setHashOptions] = React.useState<string>('')

  const { match } = useBattle()

  const OnClickOptions = (options: string) => {
    const key = utils.keccak256(utils.toUtf8Bytes("SECRET_KEY"));
    const data = utils.keccak256(utils.toUtf8Bytes(options))
    const timestamp = new Date().getTime()

    setHashOptions(utils.solidityKeccak256(['bytes32', 'bytes32', 'uint64'], [key, data, timestamp]))
  }

  const setBetting = useMutation({
    mutationKey: ["setBetting"],
    mutationFn: async (data: SETBETTINGTYPES) => {
      if (match.battle?.value.option != undefined) return match

      const { playerId, locationId, hashOption } = data
      const tx = await worldSend('setBetting', [playerId, locationId, hashOption])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return match
  }})

  return {
    playerId,
    locationId,
    hashOptions,
    OnClickOptions,
    setPlayerId,
    setLocationId,
    setBetting
  }
}
