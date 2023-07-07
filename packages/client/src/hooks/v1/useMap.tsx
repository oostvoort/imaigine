import { useMUD } from '@/MUDContext'
import { useEntityQuery, useRows } from '@latticexyz/react'
import { Has, Entity } from '@latticexyz/recs'
import React, { useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getFromIPFS } from '@/global/utils'
import { awaitStreamValue } from '@latticexyz/utils'

const getRevealedCells = (bitMap: BigNumber[]) => {
  const revealedCells: number[] = []
  if (!bitMap.length) return revealedCells
  for (let i = 0; i < bitMap.length; i++) {
    for (let j = (i * 1024); j < (i + 1) * 1024 && !bitMap[i].eq(0); j++) {
      const arrayRow = Math.round(j / 1024)
      const arrayColumn = j % 1024;
      const currentBit = bitMap[arrayRow]
      const shiftedRight = currentBit.shr(arrayColumn).and(1)
      if (!shiftedRight.eq(0)) {
        revealedCells.push(j)
      }
    }
  }
  return revealedCells
}

export const useMap = () => {
  const {
    network: {
      storeCache,
      playerEntity,
      worldSend,
      txReduced$
    },
    components: {
      PlayerComponent
    },
  } = useMUD()

  const [configIpfs, setConfigIpfs] = useState<Record<string, {name: string, summary: string}>>({})

  const playerEntities = useEntityQuery([
    Has(PlayerComponent)
  ])

  const configs = useRows(storeCache, { table: 'ConfigComponent' })
    .filter(({key}) => playerEntities.includes(key.key as Entity))

  useQuery({
    queryKey: ['queryConfigIpfs', configs],
    queryFn: async () => {
      const toFetch = configs
        .filter(({key}) => !configIpfs[key.key])
        .map(config => getFromIPFS(config.value.value)
          .then(async (result) => {
              const json = await result.json()
              setConfigIpfs(prevConfigIpfs => {
              if (prevConfigIpfs[config.key.key]) return prevConfigIpfs
              return {
                ...prevConfigIpfs,
                [config.key.key]: json
              }
            })
          }))
      return await Promise.all(toFetch)
    },
    enabled: !!configs.length
  })

  const travel = useMutation(async () => {
    const tx = await worldSend('travel', [])
    await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
  })

  const prepareTravel = useMutation(async ({toLocation}: {toLocation: number}) => {
    const tx = await worldSend('prepareTravel', [toLocation])
    await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
  })

  const mapCells = useRows(storeCache, { table: 'MapCellComponent' })
    .filter(({key}) => playerEntities.includes(key.key as Entity))

  const revealedCells = useRows(storeCache, { table: 'RevealedCells' })
    .filter(({key}) => playerEntities.includes(key.key as Entity))

  const players = playerEntities.map((entityId) => {
    const mapCell: bigint = mapCells.find(mapCell => mapCell.key.key === entityId)?.value.value ?? BigInt(0)
    const revealedCellInBytes = revealedCells.find(revealedCell => revealedCell.key.key === entityId)?.value.value
    const [decodedRevealedCellInBytes] = (revealedCellInBytes ? ethers.utils.defaultAbiCoder.decode(
      ['uint256[]'],
        revealedCellInBytes
    ) : [[]]) as [BigNumber[]]

    return {
      entityId,
      name: configIpfs[entityId]?.name ?? 'Loading Name',
      legend: configIpfs[entityId]?.summary ?? 'Loading Legend',
      config: configs.find(config => config.key.key === entityId)?.value.value ?? '',
      cell: Number(mapCell),
      revealedCell: getRevealedCells(decodedRevealedCellInBytes)
    }
  })

  return {
    functions: {
      travel,
      prepareTravel
    },
    players,
    myPlayer: players.find(player => player.entityId === playerEntity)
  }
}
