import { MUDChain, latticeTestnet } from "@latticexyz/common/chains";
import { foundry } from "@wagmi/chains";

// If you are deploying to chains other than anvil or Lattice testnet, add them here

const optimismTestnet = {
  name: "Optimism Goerli",
  id: 420,
  network: "optimis-goerli",
  nativeCurrency: { decimals: 18, name: "Goerli ETH", symbol: "ETH" },
  rpcUrls: {
    default: {
      http: ["https://goerli.optimism.io"],
    },
    public: {
      http: ["https://goerli.optimism.io"]
    }
  },
  blockExplorers: {
    default: {
      name: "The Optimism Goerli Explorer",
      url: "https://goerli-optimism.etherscan.io/"
    }
  }
}
export const supportedChains: MUDChain[] = [foundry, latticeTestnet, optimismTestnet];
