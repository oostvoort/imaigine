import { foundry, optimismGoerli } from '@wagmi/chains'

/* CONTRACTS */
export const supportedChains = [foundry, optimismGoerli]
export const CHAIN_ID = process.env.CHAIN_ID ?? '31337'

if (supportedChains.findIndex(({id}) => id === parseInt(CHAIN_ID)) === -1) throw new Error("Unsupported CHAIN_ID")
export const JSON_RPC_URL = supportedChains.find(({id}) => id === parseInt(CHAIN_ID))?.rpcUrls.default.http[0] ??
  foundry.rpcUrls.default.http[0]


/* IPFS */
export const BASE_CONFIG_IPFS = "QmW8bo43CN712gS1s5hiQSJBHfrJyHtBhqWLcTWf8noCMb"
export const LOCATION_LIST_IPFS = "QmTasufyKYeJut6uuZCQe962sKfD1RD19JwyMZfPGq7yTD"

/* SETTINGS */
export const DB_SOURCE = "logs.sqlite"

/* MAP */
export const MAP_SEED = 962218354
