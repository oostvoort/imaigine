import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import envs from '../env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function camelCaseToTitle(text: string) {
  const result = text.replace(/([A-Z])/g, " $1")
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function generateIpfsImageLink(param: string) {
  return `${envs.API_IPFS_URL_PREFIX}/${param}`
}
