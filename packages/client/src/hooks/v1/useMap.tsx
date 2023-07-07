import { useMUD } from '@/MUDContext'
import { useEntityQuery, useRows } from '@latticexyz/react'
import { Has, Entity } from '@latticexyz/recs'
import React from 'react'
import { BigNumber, ethers } from 'ethers'

const EMPTY_ARRAY = [0, 0, 0, 0]

// function isCellRevealed(uint256 self, uint256 bitIndex) internal pure returns (bool) {
//   return (self >> bitIndex) & 1 != 0;

const LAST_CELL_NUMBER = 4096


const FAKE_CONFIG = [
  {
    name: 'Anna Sorokin',
    legend: 'Anna Sorokin likes pie'
  },
  {
    name: 'Elias',
    legend: 'Some sort of straight dude'
  },
  {
    name: 'Taylor Swift',
    legend: 'For the ERAS CONCERT'
  },
  {
    name: 'Denise',
    legend: 'A cute knight'
  }
]


const randomConfigGenerator = () => {
  return FAKE_CONFIG[Math.floor(Math.random() * FAKE_CONFIG.length)]
}

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
      storeCache,
      playerEntity
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

  const players = playerEntities.map((entityId) => {
    const mapCell: bigint = mapCells.find(mapCell => mapCell.key.key === entityId)?.value.value ?? BigInt(0)
    const revealedCellInBytes = revealedCells.find(revealedCell => revealedCell.key.key === entityId)?.value.value
    const decodedRevealedCellInBytes = (revealedCellInBytes ? ethers.utils.defaultAbiCoder.decode(
      ['uint256[]'],
        revealedCellInBytes
    ) : []) as BigNumber[]
    const config = randomConfigGenerator()

    return {
      entityId,
      name: config.name,
      legend: config.legend,
      config: configs.find(config => config.key.key === entityId)?.value.value ?? '',
      mapCell: Number(mapCell),
      revealedCell: [1, 2, 3, 4]
    }
  })

  return {
    players
  }
}
