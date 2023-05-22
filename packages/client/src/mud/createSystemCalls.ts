import { SetupNetworkResult } from './setupNetwork'
import { ClientComponents } from './createClientComponents'
import { Entity, getComponentValue, HasValue, runQuery } from '@latticexyz/recs'

import {
  GenerateLocationProps,
  GenerateLocationResponse,
  GeneratePathProps,
  GeneratePathResponse,
  GeneratePlayerCharacterProps,
  GenerateStoryProps,
  JsonResponse,
} from 'types'
import api from '../lib/api'
import { IWorld__factory } from 'contracts/types/ethers-contracts/factories/IWorld__factory'
import { hexZeroPad, Interface } from 'ethers/lib/utils'
import { awaitStreamValue } from '@latticexyz/utils'

const worldAbi = IWorld__factory.abi
const worldInterface = new Interface(worldAbi)

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { world, worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  {
    CharacterComponent,
    PlayerComponent,
    LocationComponent,
    NameComponent,
    SummaryComponent,
    PathComponent,
    PathLocationComponent,
    StoryComponent,
    ImageComponent,
  }: ClientComponents,
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

  const createStartingLocation = async (props: GenerateLocationProps, connections = 2) => {
    console.log('createStartingLocation', props)

    let startingLocation: Entity = {} as Entity
    const toLocations: Array<Entity> = []

    // Create locations
    for (let i = 0; i < connections; i++) {
      const res: GenerateLocationResponse = await api('/generateLocation', props)
      const tx = await worldSend('createLocation', [ res.name, res.summary, res.imageHash ])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)

      const locationQuery: Set<Entity> = runQuery([
        HasValue(NameComponent, { value: res.name }),
        HasValue(SummaryComponent, { value: res.summary }),
        HasValue(ImageComponent, { value: 'QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps' }),
      ])

      const location = locationQuery.values().next().value as Entity

      if (i == 0) startingLocation = location
      else toLocations.push(location)
    }

    const startingLocationName = getComponentValue(NameComponent, startingLocation)
    const startingLocationSummary = getComponentValue(SummaryComponent, startingLocation)
    if (!startingLocationName) return Error('Invalid startingLocationName')
    if (!startingLocationSummary) return Error('Invalid startingLocationSummary')

    // Connect locations
    for (const toLocation of toLocations) {
      const toLocationName = getComponentValue(NameComponent, toLocation)
      const toLocationSummary = getComponentValue(SummaryComponent, toLocation)

      if (!toLocationName) return Error('Invalid startingLocationName')
      if (!toLocationSummary) return Error('Invalid startingLocationSummary')

      const generatePathProps: GeneratePathProps = {
        toLocation: {
          name: toLocationName.value,
          summary: toLocationSummary.value,
        },
        fromLocation: {
          name: startingLocationName.value,
          summary: startingLocationSummary.value,
        },
        story: props.story,
      }
      const res: GeneratePathResponse = await api('/generatePath', generatePathProps)

      const tx = await worldSend('createPath', [
        hexZeroPad(startingLocation.toString(), 32),
        hexZeroPad(toLocation.toString(), 32),
        res.name,
        res.summary,
      ])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    }
  }

  const selectPlayerLocation = async (optionLocationID: string) => {
    console.info({ optionLocationID })
    await worldSend('selectPlayerLocation', [ optionLocationID ])
  }

  return {
    createStartingLocation,
    selectPlayerLocation,
    createPlayer,
    createStory,
  }
}
