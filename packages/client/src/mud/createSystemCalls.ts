import { SetupNetworkResult } from './setupNetwork'
import {} from 'contracts/types/ethers-contracts/IWorld'
import { ClientComponents } from './createClientComponents'

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  components: ClientComponents
) {

  const selectPlayerLocation = async (optionLocationID: string) => {
    console.info({ optionLocationID })
    await worldSend("selectPlayerLocation", [optionLocationID])
  }

  return {
    selectPlayerLocation
  }
}
