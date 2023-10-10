import { MUDChain } from "@latticexyz/common/chains";
import { foundry, optimismGoerli } from '@wagmi/chains'

const mainnet_forkserver = {
  id: 439956433674,
  name: 'Forkserver',
  network: 'forkserver',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: {
      http: ['https://fork.oostvoort.work/'],
      webSocket: ["wss://fork.oostvoort.work/"],
    },
    default: {
      http: ['https://fork.oostvoort.work/'],
      webSocket: ["wss://fork.oostvoort.work/"],
    },
    blockExplorers: {
      otterscan: {
        name: "Otterscan",
        url: "https://explorer.testnet-chain.linfra.xyz",
      },
      default: {
        name: "Otterscan",
        url: "https://explorer.testnet-chain.linfra.xyz",
      },
    },
    modeUrl: "https://mode.testnet-mud-services.linfra.xyz",
    faucetUrl: "https://faucet.testnet-mud-services.linfra.xyz",
  }
}

// If you are deploying to chains other than anvil or Lattice testnet, add them here
export const supportedChains: MUDChain[] = [mainnet_forkserver, foundry, optimismGoerli];
