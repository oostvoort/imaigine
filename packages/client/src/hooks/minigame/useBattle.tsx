import { useMUD } from '@/MUDContext'
import { Entity } from '@latticexyz/recs'
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
    },
    network: {
      worldSend,
      txReduced$
    }
  } = useMUD()

  const [, setHashAtom] = useAtom(hash_options_set_value)

  const [battleOption, setBattleOption] = useState<PromiseOrValue<string>>("NONE")

  const battleData = {
    battle: useComponentValue(BattleComponent, playerId),
  }

  const onSelectOptions = (options: string) => {
    const key = utils.keccak256(utils.toUtf8Bytes("SECRET_ID"))
    const data = utils.keccak256(utils.toUtf8Bytes(options))
    const timestamp = new Date().getTime()

    const hashOptions = utils.solidityKeccak256(["string", "string", "uint256"], [key, data, timestamp])

    setBattleOption(hashOptions)
    setHashAtom({ key, data, timestamp })
  }

  const setBattle = useMutation({
    mutationKey: ["setBattle"],
    mutationFn: async () => {

      if (battleOption == undefined) throw new Error("Requested options is empty")

      const tx = await worldSend('battle', [battleOption])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      return battleData
    }
  })

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
    onSelectOptions
  }
}
