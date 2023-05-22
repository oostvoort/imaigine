import { SetupNetworkResult } from './setupNetwork'
import { ClientComponents } from './createClientComponents'
import {
  GenerateLocationProps,
  GenerateLocationResponse,
  GeneratePlayerCharacterProps,
  GenerateStoryProps,
  JsonResponse,
} from 'types'
import api from '../lib/api'
import { awaitStreamValue } from '@latticexyz/utils'

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  components: ClientComponents,
) {

  const createPlayer = async (props: GeneratePlayerCharacterProps) => {
    const res = await api('/generatePlayerCharacter', props)
    console.log(res)
    await worldSend('createPlayer', props)
  }

  const createStory = async (props: GenerateStoryProps) => {
    const res: JsonResponse = await api('/generateStory', props)
    await worldSend('createStory', [ res.name, res.summary, props.theme, props.races, props.currency ])
  }

  const createStartingLocation = async (props: GenerateLocationProps) => {
    console.debug('createStartingLocation')

    const res0: GenerateLocationResponse = await api('/generateLocation', props)
    await worldSend('createLocation', [ res0.name, res0.summary, res.imageHash ])

    const res1: GenerateLocationResponse = await api('/generateLocation', props)
    let tx = await worldSend('createLocation', [ res1.name, res1.summary, res.imageHash ])

    tx = await tx.wait()

    console.log(tx)

  }

  const selectPlayerLocation = async (optionLocationID: string) => {
    console.info({ optionLocationID })
    await worldSend('selectPlayerLocation', [ optionLocationID ])
  }

  return {
    createLocation: createStartingLocation,
    selectPlayerLocation,
    createPlayer,
    createStory,
  }
}
