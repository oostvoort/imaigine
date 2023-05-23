import { useMUD } from '../MUDContext'
import { useEntityQuery } from '@latticexyz/react'
import { Entity, getComponentEntities, getComponentValue, getComponentValueStrict, Has, Not } from '@latticexyz/recs'
import { defaultAbiCoder, hexDataSlice, hexValue, hexZeroPad, Interface } from 'ethers/lib/utils'
import { IWorld__factory } from 'contracts/types/ethers-contracts'
import { ethers } from 'ethers'
import { decodeActionData } from '../lib/utils'

const worldAbi = IWorld__factory.abi
const worldInterface = new Interface(worldAbi)

export default function useGame() {
  const {
    components: {
      CharacterComponent,
      PlayerComponent,
      LocationComponent,
      NameComponent,
      SummaryComponent,
      PathComponent,
      PathLocationComponent,
      StoryComponent,
      SceneComponent,
      ImageComponent,
      InteractComponent,
      AliveComponent,
      ActionsComponent,
      LogComponent,
      PossibleComponent,
    },
    network: { playerEntity, singletonEntity, storeCache },
    systemCalls,
  } = useMUD()

  const story = useEntityQuery([ Has(StoryComponent), Has(SummaryComponent) ]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const summary = getComponentValueStrict(SummaryComponent, entity)
    return {
      entity,
      name,
      summary,
    }
  })[0]

  const player = useEntityQuery([ Has(PlayerComponent), Has(NameComponent), Has(SummaryComponent), Has(ImageComponent) ])
    .filter((entity) => entity == playerEntity)
    .map((entity) => {
      const name = getComponentValueStrict(NameComponent, entity)
      const summary = getComponentValueStrict(SummaryComponent, entity)
      const image = getComponentValueStrict(ImageComponent, entity)
      const alive = getComponentValue(AliveComponent, entity)
      const location = getComponentValue(LocationComponent, entity)

      return {
        entity,
        name,
        summary,
        image,
        location,
        alive: alive?.value ?? false,
      }
    })[0]

  const currentLocation = useEntityQuery([ Has(SceneComponent), Has(NameComponent), Has(ImageComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false
      const currentLocation = getComponentValue(LocationComponent, playerEntity)
      if (!currentLocation) return false
      return (hexValue(currentLocation.value) == hexValue(entity))
    })
    .map(mapLocations)[0]

  const startingLocation = useEntityQuery([ Has(SceneComponent), Has(NameComponent), Has(SummaryComponent), Has(ImageComponent) ]).map(mapLocations)[0]

  const locations = useEntityQuery([ Has(SceneComponent), Has(NameComponent), Has(SummaryComponent), Has(ImageComponent) ])
    .map(mapLocations)

  const paths = useEntityQuery([ Has(PathComponent), Has(PathLocationComponent), Has(NameComponent), Has(SummaryComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false
      const pathLocation = getComponentValueStrict(PathLocationComponent, entity)
      const currentLocation = getComponentValue(LocationComponent, playerEntity)
      if (!currentLocation) return false
      return pathLocation.location0 == currentLocation.value || pathLocation.location1 == currentLocation.value
    })
    .map((entity) => {
      const name = getComponentValueStrict(NameComponent, entity)
      const summary = getComponentValueStrict(SummaryComponent, entity)
      const pathLocation = getComponentValue(PathLocationComponent, entity)
      const pathLocations = pathLocation && [
        locations.find(location => hexValue(location.entity) == hexValue(pathLocation.location0)),
        locations.find(location => hexValue(location.entity) == hexValue(pathLocation.location1)),
      ]

      return {
        entity,
        name,
        summary,
        pathLocations,
      }
    })

  const characters = useEntityQuery([ Has(CharacterComponent), Not(PlayerComponent), Has(LocationComponent) ])
    .filter((entity) => {
      return inPlayersLocation(entity)
    })
    .map((entity) => {
      const name = getComponentValueStrict(NameComponent, entity)
      const summary = getComponentValueStrict(SummaryComponent, entity)
      const image = getComponentValueStrict(ImageComponent, entity)
      const alive = getComponentValue(AliveComponent, entity)
      return {
        entity,
        name,
        summary,
        image,
        alive: alive?.value ?? false,
      }
    })

  // Result is very similar to characters query, considering replacing characters
  // Interactions happening in the player's location
  const interactions = useEntityQuery([ Has(InteractComponent) ])
    .filter((entity) => {
      return inPlayersLocation(entity)
    })
    .map(mapInteraction)

  // Current interaction the player is involved in
  const currentInteraction = useEntityQuery([ Has(InteractComponent) ])
    .filter((entity) => {
      const interaction = getComponentValueStrict(InteractComponent, entity)
      const result = defaultAbiCoder.decode([ 'bytes32[]' ], interaction.participants)
      if (result[0].length == 0) return false
      const currentInteraction = result
        .map(participant => hexDataSlice(participant[0], 12))
        .find(participant => {
          return participant == playerEntity
        })
      return currentInteraction != null
    })
    .map(mapInteraction)[0]


  const otherPlayers = useEntityQuery([ Has(PlayerComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false
      if (entity == playerEntity) return false
      return inPlayersLocation(entity)
    })
    .map((entity) => {
      const name = getComponentValueStrict(NameComponent, entity)
      const summary = getComponentValueStrict(SummaryComponent, entity)
      const image = getComponentValueStrict(ImageComponent, entity)
      return {
        entity,
        name,
        summary,
        image,
      }
    })


  // Helper Functions
  function mapLocations(entity: Entity) {
    const name = getComponentValueStrict(NameComponent, entity)
    const summary = getComponentValueStrict(SummaryComponent, entity)
    const image = getComponentValueStrict(ImageComponent, entity)
    return {
      entity,
      name,
      summary,
      image,
    }
  }


  function mapInteraction(entity: Entity) {
    const interaction = getComponentValueStrict(InteractComponent, entity)
    const name = getComponentValueStrict(NameComponent, entity)
    const summary = getComponentValueStrict(SummaryComponent, entity)
    const image = getComponentValueStrict(ImageComponent, entity)
    const alive = getComponentValue(AliveComponent, entity)
    const logHash = getComponentValue(LogComponent, entity)

    const entitiesWithPossibleComponentIter = getComponentEntities(PossibleComponent)
    let considered = null

    for (const value of entitiesWithPossibleComponentIter) {
      if (
        value.split(':')[0] == hexZeroPad(playerEntity as any, 32) &&
        value.split(':')[1] == hexZeroPad(entity as any, 32)
      ) {
        considered = value
        break
      }
    }

    const possible = considered ? getComponentValue(PossibleComponent, considered) : null

    const actions = possible ? decodeActionData(possible.actions, Number(possible.actionLength.toString())).map((p: any) => {

      return {
        mode: p[0],
        content: p[1],
        karmaChange: p[2],
      }
    }) : []

    const otherParticipants = ethers.utils.defaultAbiCoder.decode([ 'bytes32[]' ], interaction.participants)
      .filter(entity => {
        if (!entity || entity.length == 0) return false
        return hexDataSlice(entity[0], 12) != playerEntity
      })
      .map(entity => {
        const name = getComponentValueStrict(NameComponent, entity)
        const summary = getComponentValueStrict(SummaryComponent, entity)
        const alive = getComponentValue(AliveComponent, entity)
        return {
          entity,
          name: name.value,
          summary: summary.value,
          alive: alive?.value ?? false,
        }
      })
    return {
      // The entity you are interacting with
      entity: {
        entity,
        name: name.value,
        summary: summary.value,
        image: image.value,
        alive: alive?.value ?? false,
      },
      logHash: logHash,
      initialActions: interaction.initialActions,
      initialMsg: interaction.initialMsg,
      otherParticipants,
      possible: actions,
    }
  }


  function inPlayersLocation(entity: any) {
    if (!playerEntity) return false
    const location = getComponentValue(LocationComponent, entity)
    if (!location) return false
    const currentLocation = getComponentValue(LocationComponent, playerEntity)
    if (!currentLocation) return false
    return location.value == currentLocation.value
  }


  return {
    currentInteraction,
    interactions,
    currentLocation,
    player,
    startingLocation,
    story,
    locations,
    characters,
    otherPlayers,
    paths,
  }
}

