import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers, BytesLike } from 'ethers'
import envs from '../env'
import { hexDataSlice } from 'ethers/lib/utils'

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

export type ActionData = [string,string,number]

export function encodeActionData(data: ActionData): BytesLike {
  return ethers.utils.defaultAbiCoder.encode(["tuple(string,string,int256)"], [data]) as BytesLike
}

export function encodeActionDataArray(data: ActionData[]): any {
  // return data.map(d => encodeActionData(d))
  return ethers.utils.defaultAbiCoder.encode(
    data.map(() => "tuple(string,string,int256)"),
    data
  )
}

export function decodeActionData(data: BytesLike, length = 3): ActionData {
  const types = []

  for (let i=0; i<length; i++) {
    types.push("tuple(string,string,int256)")
  }

  return ethers.utils.defaultAbiCoder.decode(
    types,
    data
  ) as ActionData
}

export function decodeActionDataArray(data: BytesLike[]): ActionData[] {
  return data.map(d => decodeActionData(d))
}
