import { SetupNetworkResult } from './setupNetwork'
import { ClientComponents } from './createClientComponents'
import { Entity, getComponentValue, HasValue, runQuery } from '@latticexyz/recs'

import {
  GenerateInteractionProps, GenerateInteractionResponse,
  GenerateLocationProps,
  GenerateLocationResponse, GenerateNonPlayerCharacterProps,
  GeneratePathProps,
  GeneratePathResponse,
  GeneratePlayerCharacterProps, GeneratePlayerCharacterResponse,
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


  const createStory = async (props: GenerateStoryProps) => {
    console.log('createStory', props)

    const res: JsonResponse = await api('/generateStory', props)
    await worldSend('createStory', [ res.name, res.summary, props.theme, props.races, props.currency ])

    console.log('createStory done!')
  }

  const createStartingLocation = async (props: GenerateLocationProps, locations = 2) => {
    console.log('createStartingLocation', props)

    let startingLocation: Entity = {} as Entity
    const toLocations: Array<Entity> = []

    async function createLocation(i: number) {
      const res: GenerateLocationResponse = await api('/generateLocation', props)
      const tx = await worldSend('createLocation', [ res.name, res.summary, res.imageHash ])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)

      const locationQuery: Set<Entity> = runQuery([
        HasValue(NameComponent, { value: res.name }),
        HasValue(SummaryComponent, { value: res.summary }),
        HasValue(ImageComponent, { value: res.imageHash }),
      ])

      const location = locationQuery.values().next().value as Entity

      if (i == 0) startingLocation = location
      else toLocations.push(location)
    }

    let promises = []

    for (let i = 0; i < locations; i++) {
      promises.push(await createLocation(i))
    }

    await Promise.all(promises)

    promises = []

    const startingLocationName = getComponentValue(NameComponent, startingLocation)
    const startingLocationSummary = getComponentValue(SummaryComponent, startingLocation)

    async function connectLocations(toLocation: Entity) {
      const toLocationName = getComponentValue(NameComponent, toLocation)
      const toLocationSummary = getComponentValue(SummaryComponent, toLocation)

      if (!toLocationName) return Error('Invalid startingLocationName')
      if (!toLocationSummary) return Error('Invalid startingLocationSummary')
      if (!startingLocationName) return Error('Invalid startingLocationName')
      if (!startingLocationSummary) return Error('Invalid startingLocationSummary')

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


    for (const toLocation of toLocations) {
      promises.push(connectLocations(toLocation))
    }

    await Promise.all(promises)

    console.log('createStartingLocation done!')
  }

  const createPlayer = async (props: GeneratePlayerCharacterProps, startingLocation: Entity) => {
    console.log('createPlayer', props)
    const res = await api('/generatePlayerCharacter', props)
    await worldSend('createPlayer', [
      res.name,
      res.summary,
      res.imageHash,
      hexZeroPad(startingLocation.toString(), 32),
    ])
    console.log('createPlayer done!')
  }

  const createCharacter = async (props: GenerateNonPlayerCharacterProps, startingLocation: Entity) => {
    console.log('createCharacter', props)
    const res: GeneratePlayerCharacterResponse = await api('/generateNonPlayerCharacter', props)
    await worldSend('createCharacter', [
      res.name,
      res.summary,
      res.imageHash,
      hexZeroPad(startingLocation.toString(), 32),
      res.initialMessage,
      [],
    ])
    console.log('createCharacter done!')
  }

  const enterInteraction = async (entityID: string) => {
    console.log('enterInteraction', hexZeroPad(entityID, 32))
    await worldSend('enterInteraction', [ hexZeroPad(entityID, 32), ])
    console.log('enterInteraction done!')
  }

  const saveInteraction = async (props: GenerateInteractionProps, entityID: string) => {
    const res: GenerateInteractionResponse = await api('/generateNonPlayerCharacter', props)
    // await worldSend('saveInteraction', [
    //   hexZeroPad(entityID, 32),
    //   hexZeroPad("0x0", 32),
    //   res.logHash,
    //   participants,
    //   participantsActions,
    // ])
  }


  const playerTravelPath = async (optionLocationID: string) => {
    console.info({ optionLocationID })
    await worldSend('playerTravelPath', [ optionLocationID ])
  }

  return {
    saveInteraction,
    enterInteraction,
    createCharacter,
    createStartingLocation,
    playerTravelPath,
    createPlayer,
    createStory,
  }
}
