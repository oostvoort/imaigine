import { SetupNetworkResult } from './setupNetwork'
import { ClientComponents } from './createClientComponents'
import { Entity, getComponentValue, HasValue, runQuery } from '@latticexyz/recs'

import {
  GenerateDescriptiveLocationProps,
  GenerateDescriptiveLocationResponse,
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
import { hexZeroPad, Interface } from 'ethers/lib/utils'
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

  const createDescriptiveLocation = async (props: GenerateDescriptiveLocationProps) => {
    console.log('createDescriptiveLocation', props)

    let startingLocation: Entity = {} as Entity
    const toLocations: Array<Entity> = []

    console.info('getting the locations, npc and items from backend')

    // const data: GenerateDescriptiveLocationResponse = await api('/generateDescriptiveLocation', { ...props, generateElementImages: true  })

    const data: GenerateDescriptiveLocationResponse = {
      'mainLocation': {
        'name': 'Lac-ul Nora',
        'summary': 'Lacul Nora is a very large and very safe coral reef biome located in the middle of Amadea, an incredibly beautiful world filled with vibrant and luscious plantations. It is an upper middle class settlement and is popular among the natives, elves, orcs, and nymphs. It is surrounded by two other settlements, Frostal Ah and Aureal Lakes, both a few milesp away from Lacul Nora. It is known for its two mystical items - the Oracle Orb and the Starfall Gauntlet - which both offer the locals a connection with the realm of magic. Two of the most popular characters in the area are Lucina Valsam and Trevor Yule, both of whom have been around for centuries and are known to be very wise and wise. Visually, Lacul Nora is a stunning coral reef with clear blue waters and sparkling gems that give off a subtle glow in the night. ',
        'visualSummary': 'coral reef, clear waters, sparkling gems, subtle glow in the night',
        'imageHash': 'Qmc265Ri761WJx9Q4GMXD8icoW5yoPLJTzuXgs1HmbJQb5',
      },
      'elements': {
        'locations': [
          {
            'name': 'Lacul Nora',
            'summary': 'Lacul Nora is a very large and very safe coral reef biome located in the middle of Amadea. It is an upper middle class settlement and is popular among the natives, elves, orcs, and nymphs. It is surrounded by two other settlements, Frostal Ah and Aureal Lakes, both a few miles away from Lacul Nora. Visually, Lacul Nora is a stunning coral reef with clear blue waters and sparkling gems that give off a subtle glow in the night.',
            'visualSummary': 'coral, reef, clear blue waters, gems, subtle glow',
            'imageHash': 'Qmc265Ri761WJx9Q4GMXD8icoW5yoPLJTzuXgs1HmbJQb5',
          },
          {
            'name': 'Frostal Ah',
            'summary': 'Frostal Ah is one of the two settlements located near Lacul Nora. It is located a few miles away and is surrounded by lush forests and the distant mountains of Amadea. The town is known for its friendly yet relaxed atmosphere and its bustling marketplace where locals come to buy and sell goods.',
            'visualSummary': 'lush forests, distant mountains, bustling marketplace',
            'imageHash': 'QmUiEoA6hnjC2rNn4ji3mo5ceacDdQU4sr3udPHXQoNHZj',
          },
          {
            'name': 'Aureal Lakes',
            'summary': 'Aureal Lakes is one of the two settlements located near Lacul Nora. It is located a few miles away and is encompassed by vast lakes and wetlands, giving off an enchanting and peaceful atmosphere. The town is also known for its world renowned magical artifacts and relics, which draw many adventurers to the area in search of something special.',
            'visualSummary': 'vast lakes, wetlands, enchanting, peaceful, world renowned magical artifacts',
            'imageHash': 'QmX9GP9Gj9nS2MvxpuReQJM3kSRopzGCV7JfGgbP8QEqQM',
          },
        ],
        'items': [
          {
            'name': 'Oracle Orb',
            'summary': 'The Oracle Orb is a mystical item found in Lacul Nora that offers the locals a connection with the realm of magic. It is a powerful relic of great importance to the town, as it is said to provide insight to the future and even confer powerful protection from harm. The Orb is usually kept hidden and only the bravest of adventurers are able to find it.',
            'visualSummary': 'mystical, realm of magic, powerful, hidden',
            'imageHash': 'QmcDc5jMjY1YkYwrDuoGnKJSi8vtBmDZhhpmv913i2Rvy4',
          },
          {
            'name': 'Starfall Gauntlet',
            'summary': 'The Starfall Gauntlet is another mystical item found in Lacul Nora that provides locals with a special connection to the realm of magic. It is an ancient artifact that grants its user vast magical abilities, although its power is limited and should be used wisely. It has been rumored to be kept in a hidden chamber deep within the coral reef, making it very hard to recover.',
            'visualSummary': 'mystical, realm of magic, ancient, magical abilities, hidden',
            'imageHash': 'QmehX8tZ3aXPPz4GDkN4nE8bAwLv16H2vZD2zyud1NYLz4',
          },
        ],
        'characters': [
          {
            'name': 'Lucina Valsam',
            'summary': 'Lucina Valsam is one of the two most popular characters in the Lacul Nora area. She has been around for centuries and is known to be very wise and wise. She is an elf with sharp, green eyes, and long wavy brown hair. She is known to wear extravagant jewelry and clothing that makes her stand out from the crowd.',
            'visualSummary': 'elf, green eyes, long wavy brown hair, extravagant jewelry, clothing',
            'imageHash': 'QmSu93jEFvFwL4wwgHsaTjpTLxM1eELntBJz2EPBEf7HhR',
          },
          {
            'name': 'Trevor Yule',
            'summary': 'Trevor Yule is the other most popular character in the Lacul Nora area. He has been around for centuries and is known to be very wise and wise. He is an orc with dark brown eyes, a thick black beard and tanned skin. He is known to wear bright colored clothing with ludicrous jewelry and accessories that draw the attention of many.',
            'visualSummary': 'orc, dark brown eyes, black beard, tanned skin, bright colored clothing, ludicrous jewelry',
            'imageHash': 'QmPxcVgsoyjNeFi835owXpZdrmqcUNRaC3CN82zr5vBspE',
          },
        ],
      },
    }

    console.info('GenerateDescriptiveLocationResponse', data)

    async function createLocation(i: number, location: any) {
      if (!location.imageHash) throw new Error('no image hash!')

      console.info(location)
      console.info('execute worldSend createLocation')
      const tx = await worldSend('createLocation', [
        location.name,
        location.summary,
        location.imageHash,
      ])

      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      console.info('awaitStreamValue done!')

      const locationQuery: Set<Entity> = runQuery([
        HasValue(NameComponent, { value: location.name }),
        HasValue(SummaryComponent, { value: location.summary }),
        HasValue(ImageComponent, { value: location.imageHash }),
      ])

      const loc = locationQuery.values().next().value as Entity

      if (i == 0) startingLocation = loc
      else toLocations.push(loc)
    }

    const promises = []

    for (let i = 0; i < (data.elements.locations.length); i++) {
      promises.push(await createLocation(i, data.elements.locations[i]))
    }

    await Promise.all(promises)
    console.info('done creating locations!')

    return {
      startingLocation: startingLocation,
      toLocations: toLocations,
      descriptiveLocationData: data,
    }
  }

  async function createPath(startingLocation: Entity, toLocations: Entity[], story: any) {
    const startingLocationName = getComponentValue(NameComponent, startingLocation)
    const startingLocationSummary = getComponentValue(SummaryComponent, startingLocation)

    console.info('creating paths ...')

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
        story: story.summary,
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

    const promises = []

    for (const toLocation of toLocations) {
      promises.push(connectLocations(toLocation))
    }

    await Promise.all(promises)
    console.info('Done creating paths!')
  }

  async function createCharacters(characters: any[], startingLocation: Entity) {
    const promises = []
    console.info('creating characters ...')

    for (const character of characters) {
      promises.push(
        await worldSend('createCharacter', [
          character.name,
          character.summary,
          character.imageHash,
          hexZeroPad(startingLocation.toString(), 32),
          '',
          [],
        ]),
      )
    }
    await Promise.all(promises)
    console.info('Done creating characters!')
  }

  async function createItems(items: any[], startingLocation: Entity) {
    const promises: any[] = []
    console.info('creating items ...')

    for (const item of items) {
      await worldSend('createItem', [
        item.name,
        item.summary,
        item.imageHash,
        hexZeroPad(startingLocation.toString(), 32),
        `${item.name}`,
        [ 'action1', 'action2', 'action3' ],
        hexZeroPad('0x0', 32),
      ])
    }

    await Promise.all(promises)
    console.info('Done creating items!')
  }

  async function createMyPlayer(name: string, summary: string, imageHash: string, startingLocation: Entity) {
    await worldSend('createPlayer', [
      name,
      summary,
      imageHash,
      hexZeroPad(startingLocation.toString(), 32),
    ])
    console.log('createPlayer done!')
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
        entity: startingLocation,
      },
      story: props.story,
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
    const tx = await worldSend('enterInteraction', [ hexZeroPad(entityID, 32) ])
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
      ],
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
    createDescriptiveLocation,
    createPath,
    createCharacters,
    createItems,
    createMyPlayer
  }
}
