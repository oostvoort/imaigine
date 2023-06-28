import { IWorld__factory } from "../../../contracts/types/ethers-contracts/factories/IWorld__factory";
import { providers, Wallet } from 'ethers'
import worldsJson from "../../../contracts/worlds.json";
const worlds = worldsJson as Partial<Record<string, { address: string; blockNumber?: number }>>;

// create a signer
export const signer = new Wallet(
  process.env.PRIVATE_KEY,
  new providers.JsonRpcProvider(
    process.env.JSON_RPC_URL
  )
)
// create a world contract object
// this is already in typeScript
export const worldContract = IWorld__factory.connect(worlds[process.env.CHAIN_ID].address, signer)
