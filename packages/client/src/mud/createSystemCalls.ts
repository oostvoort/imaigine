import { SetupNetworkResult } from './setupNetwork'
import {} from 'contracts/types/ethers-contracts/IWorld'
import { ClientComponents } from './createClientComponents'
import { GeneratePlayerCharacterProps, GenerateStoryProps, JsonResponse } from 'types'
import api from '../lib/api'

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  components: ClientComponents
) {

  const createPlayer = async (props: GeneratePlayerCharacterProps) => {
    const res = await api('/generatePlayerCharacter', props)
    console.log(res)
  }

  const createStory = async (props: GenerateStoryProps) => {
    const res: JsonResponse = await api('/generateStory', props)
    await worldSend('createStory', [res.name, res.summary, props.theme, props.races, props.currency])
  }

  const selectPlayerLocation = async (optionLocationID: string) => {
    console.info({ optionLocationID })
    await worldSend("selectPlayerLocation", [optionLocationID])
  }

  return {
    selectPlayerLocation,
    createPlayer,
    createStory
  }
}
