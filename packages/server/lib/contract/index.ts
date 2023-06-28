import { IWorld__factory } from "../../../contracts/types/ethers-contracts/factories/IWorld__factory";
import { constants, providers, Wallet } from 'ethers'
import worldsJson from "../../../contracts/worlds.json";
import {
  concat,
  hexlify,
  keccak256,
  solidityPack,
  toUtf8Bytes,
} from 'ethers/lib/utils'
const worlds = worldsJson as Partial<Record<string, { address: string; blockNumber?: number }>>;

if (!process.env.PRIVATE_KEY) throw new Error('No private key provided')
const PRIVATE_KEY = process.env.PRIVATE_KEY
const JSON_RPC_URL = process.env.JSON_RPC_URL ?? 'http://127.0.0.1:8545'
const CHAIN_ID = process.env.CHAIN_ID ?? '31337'

console.info('Setting up Contract')
console.info('JSON_RPC_URL:', JSON_RPC_URL)
console.info('CHAIN_ID:', CHAIN_ID)

const bytes = toUtf8Bytes('LOCATION')
const LOCATION_PREFIX = hexlify(concat([bytes, constants.HashZero]).slice(0, 16))

// create a signer
export const signer = new Wallet(
  PRIVATE_KEY,
  new providers.JsonRpcProvider(
    JSON_RPC_URL
  )
)
// create a world contract object
// this is already in typeScript
export const worldContract = IWorld__factory.connect(worlds[CHAIN_ID].address, signer)

export const convertLocationNumberToLocationId = (locationNumber: number) => {

  return keccak256(
    solidityPack(
      ['bytes16', 'uint256'],
      [LOCATION_PREFIX, locationNumber]
    )
  )
}
