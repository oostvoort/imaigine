import { foundry, optimismGoerli, mainnet } from '@wagmi/chains'

const mainnet_forkserver = {
  ...mainnet,
  id: 88,
  name: 'Forkserver',
  network: 'forkserver',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://fork.oostvoort.work/'] },
    default: { http: ['https://fork.oostvoort.work/'] },
  }
}

/* CONTRACTS */
export const supportedChains = [mainnet_forkserver, foundry, optimismGoerli]
export const CHAIN_ID = process.env.CHAIN_ID ?? '31337'

if (supportedChains.findIndex(({id}) => id === parseInt(CHAIN_ID)) === -1) throw new Error("Unsupported CHAIN_ID")
export const JSON_RPC_URL = supportedChains.find(({id}) => id === parseInt(CHAIN_ID))?.rpcUrls.default.http[0] ??
  foundry.rpcUrls.default.http[0]


/* IPFS */
export const BASE_CONFIG_IPFS = "QmVXhy2Gr115f23cVBr1buyCXF85S6umT2mQeh3567UsuH"
export const LOCATION_LIST_IPFS = "QmTasufyKYeJut6uuZCQe962sKfD1RD19JwyMZfPGq7yTD"

/* SETTINGS */
export const DB_SOURCE = "logs.sqlite"

/* MAP */
export const MAP_SEED = 962218354

export const HOST_NAME = process.env.HOST_NAME ?? 'http://localhost:3000'
