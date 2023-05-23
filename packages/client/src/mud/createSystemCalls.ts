import { SetupNetworkResult } from './setupNetwork'
import { ClientComponents } from './createClientComponents'
import { Entity, getComponentValue, HasValue, runQuery } from '@latticexyz/recs'

import {
  GenerateInteractionProps,
  GenerateInteractionResponse,
  GenerateLocationProps,
  GenerateLocationResponse,
  GenerateNonPlayerCharacterProps,
  GeneratePathProps,
  GeneratePathResponse,
  GeneratePlayerCharacterProps,
  GeneratePlayerCharacterResponse,
  GenerateStoryProps,
  JsonResponse,
} from 'types'
import api from '../lib/api'
import { IWorld__factory } from 'contracts/types/ethers-contracts/factories/IWorld__factory'
import { defaultAbiCoder, hexConcat, hexZeroPad, Interface } from 'ethers/lib/utils'
import { awaitStreamValue } from '@latticexyz/utils'
import { ActionData, encodeActionDataArray } from '../lib/utils'
import { ethers } from 'ethers'

const worldAbi = IWorld__factory.abi
const worldInterface = new Interface(worldAbi)
const IPFS_URL_PREFIX = import.meta.env.VITE_IPFS_URL_PREFIX

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
    const worldSendRes = await worldSend('createStory', [ res.name, res.summary, props.theme, props.races, props.currency ])

    console.log('createStory done!')
    return res
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
    return {
      startingLocation: {
        name: startingLocationName,
        summary: startingLocationSummary,
        entity: startingLocation
      },
      story: props.story
    }
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
    return res
  }

  const enterInteraction = async (entityID: string, props: GenerateInteractionProps, participants: Array<string>) => {
    console.log('enterInteraction', hexZeroPad(entityID, 32))
    const tx =  await worldSend('enterInteraction', [ hexZeroPad(entityID, 32) ])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    await saveInteraction(props, ethers.constants.MaxUint256.toString(), entityID, participants)
    console.log('enterInteraction done!')
  }

  const saveInteraction = async (props: GenerateInteractionProps, actionIndex: string, entityID: string, participants: Array<string>) => {
    console.log('saveInteraction', { props, interactionEntityId: entityID, participants })
    const res: GenerateInteractionResponse = await api('/generateInteraction', props)
    const participantsActions = encodeActionDataArray(res.possible.map(p => [ p.mode, p.content, p.karmaEffect ] as ActionData))
    const tx = await worldSend('saveInteraction', [
      hexZeroPad(entityID, 32),
      actionIndex,
      res.logHash,
      participants.map(p => hexZeroPad(p, 32)),
      [
        res.possible.length,
      ],
      [
        participantsActions, // player1
      ]
    ])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    console.log('saveInteraction done!')

  }

  const leaveInteraction = async (entityID: string, playerID: string) => {
    console.log('leaveInteraction', hexZeroPad(entityID, 32))
    const tx = await worldSend('leaveInteraction', [ hexZeroPad(entityID, 32), hexZeroPad(playerID, 32) ])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    console.log('leaveInteraction done!')
  }


  const playerTravelPath = async (pathID: string) => {
    console.log('playerTravelPath', pathID)
    const tx = await worldSend('playerTravelPath', [ hexZeroPad(pathID, 32) ])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    console.log('playerTravelPath done')
  }

  return {
    saveInteraction,
    enterInteraction,
    leaveInteraction,
    createCharacter,
    createStartingLocation,
    playerTravelPath,
    createPlayer,
    createStory,
  }
}
