import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { IPFS_URL_PREFIX } from '@/global/constants'
import { ethers } from 'ethers'
import { concat, hexlify, keccak256, solidityPack, toUtf8Bytes } from 'ethers/lib/utils'
import { constants } from 'ethers'

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

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

// export function generateSecretId() {
//   const bytes = new Uint8Array(16);
//   if (window.crypto && window.crypto.getRandomValues) {
//     window.crypto.getRandomValues(bytes);
//   } else {
//     throw new Error('Your browser does not support a secure random number generator.');
//   }
//   return bytes.map(byte => byte.toString(16)).join('');
// }

export const verifyPrivateKey = (value: string) => {
  if (ethers.utils.isHexString(value)) {
    return true;
  } else {
    if (value.length === 64) {
      return ethers.utils.isHexString(`0x${value}`);
    }
    return false;
  }
};

const toBytes16 = (str: string) => {
  const bytes = toUtf8Bytes(str)
  return hexlify(concat([bytes, constants.HashZero]).slice(0, 16))
}

const LOCATION_PREFIX = toBytes16('LOCATION')

/// @dev changes cellNumber to locationId
export const convertLocationNumberToLocationId = (locationNumber: number) => {

  return keccak256(
    solidityPack(
      ['bytes16', 'uint256'],
      [LOCATION_PREFIX, locationNumber]
    )
  )
}


export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};
