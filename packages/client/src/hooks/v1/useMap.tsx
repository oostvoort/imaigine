import { useMUD } from '@/MUDContext'
import { useEntityQuery, useRows } from '@latticexyz/react'
import { Has, Entity } from '@latticexyz/recs'
import React from 'react'
import { BigNumber, ethers } from 'ethers'

const EMPTY_ARRAY = [0, 0, 0, 0]

// function isCellRevealed(uint256 self, uint256 bitIndex) internal pure returns (bool) {
//   return (self >> bitIndex) & 1 != 0;

const LAST_CELL_NUMBER = 4096

const getRevealedCells = (bitMap: BigNumber[]) => {
  console.log('input', bitMap)
  const revealedCells: number[] = []
  if (!bitMap.length) return revealedCells
  console.log(bitMap)
  for (let i = 0; i < bitMap.length; i++) {
    for (let j = (i * 1024); j < (i + 1) * 1024 && !bitMap[i].eq(0); j++) {
      const arrayRow = Math.round(j / 256)
      const arrayColumn = j % 256;
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
      storeCache
    },
    components: {
      PlayerComponent
    },
  } = useMUD()

  const playerEntities = useEntityQuery([
    Has(PlayerComponent)
  ])

  const configs = useRows(storeCache, { table: 'ConfigComponent' })
    .filter(({key}) => playerEntities.includes(key.key as Entity))

  const mapCells = useRows(storeCache, { table: 'MapCellComponent' })
    .filter(({key}) => playerEntities.includes(key.key as Entity))

  const revealedCells = useRows(storeCache, { table: 'RevealedCells' })
    .filter(({key}) => playerEntities.includes(key.key as Entity))

  const players = playerEntities.map(playerEntity => {
    const mapCell: bigint = mapCells.find(mapCell => mapCell.key.key === playerEntity)?.value.value ?? BigInt(0)
    const revealedCellInBytes = revealedCells.find(revealedCell => revealedCell.key.key === playerEntity)?.value.value
    const decodedRevealedCellInBytes = (revealedCellInBytes ? ethers.utils.defaultAbiCoder.decode(
      ['uint256[]'],
        revealedCellInBytes
    ) : []) as BigNumber[]

    return {
      entityId: playerEntity,
      config: configs.find(config => config.key.key === playerEntity)?.value.value ?? '',
      mapCell: Number(mapCell),
      revealedCell: decodedRevealedCellInBytes.length ? getRevealedCells(decodedRevealedCellInBytes) : []
    }
  })


  console.log(players)

  return {
    players
  }
}
