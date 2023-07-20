import { MUDChain, latticeTestnet } from "@latticexyz/common/chains";
import { foundry, mainnet, optimismGoerli } from '@wagmi/chains'

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

// If you are deploying to chains other than anvil or Lattice testnet, add them here
export const supportedChains: MUDChain[] = [mainnet_forkserver, foundry, latticeTestnet, optimismGoerli];
