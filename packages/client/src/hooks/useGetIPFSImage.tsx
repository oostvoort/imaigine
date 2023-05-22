import React from 'react'
import { useQuery } from '@tanstack/react-query'

const IPFS_URL = import.meta.env.VITE_IPFS_URL_PREFIX

export default function useGetIPFSImage(imageHash: string) {
  console.log(`${IPFS_URL}/${imageHash}`)
  return useQuery(['avatar-image', imageHash], async () => {
    if (!imageHash) throw new Error('fetching image from ipfs error: image hash still undefined')
    if (!IPFS_URL) throw new Error('fetching image from ipfs error: url for ipfs not defined on env')
    console.log('fetching this one: ', `${IPFS_URL}/${imageHash}`)
    return await (await fetch(`${IPFS_URL}/${imageHash}`)).body
  }, {
    enabled: Boolean(imageHash)
  })
}
