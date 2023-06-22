import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { IPFS_URL_PREFIX } from '@/global/constant'

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
