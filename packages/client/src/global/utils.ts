import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { keccak256, solidityPack } from 'ethers/lib/utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function camelCaseToTitle(text: string) {
  const result = text.replace(/([A-Z])/g, " $1")
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export async function getFromIPFS(hash: string) {
  return await fetch(`${IPFS_URL_PREFIX}/${hash}`, {
    method: 'GET',
  })
}

export function parseCellToLocationId(cell: number) {
  return (
    keccak256(solidityPack([
      'bytes16',
      'uint256',
    ],
      ['0x4c4f434154494f4e0000000000000000', cell]))
  )
}
