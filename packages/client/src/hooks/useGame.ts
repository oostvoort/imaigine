import { useMUD } from '../MUDContext'
import { useEntityQuery } from '@latticexyz/react'
import { getComponentValue, getComponentValueStrict, Has, Not } from '@latticexyz/recs'
import { defaultAbiCoder, hexDataSlice, hexStripZeros, hexValue, Interface } from 'ethers/lib/utils'
import { IWorld__factory } from 'contracts/types/ethers-contracts'
import { ethers } from 'ethers'
import { useMutation } from '@tanstack/react-query'

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
      AliveComponent
    },
    network: { playerEntity, singletonEntity },
    systemCalls: {
      createPlayer,
      createStory,
      createStartingLocation,
      createCharacter,
    },
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

      return {
        entity,
        name,
        summary,
        image,
        alive: alive?.value ?? false
      }
    })[0]

  const currentLocation = useEntityQuery([ Has(SceneComponent), Has(NameComponent), Has(ImageComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false
      const currentLocation = getComponentValue(LocationComponent, playerEntity)
      if (!currentLocation) return false
      return (hexValue(currentLocation.value) == hexValue(entity))
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
    })[0]

  const startingLocation = useEntityQuery([ Has(SceneComponent), Has(NameComponent), Has(SummaryComponent), Has(ImageComponent) ]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const summary = getComponentValueStrict(SummaryComponent, entity)
    const image = getComponentValueStrict(ImageComponent, entity)
    return {
      entity,
      name,
      summary,
      image,
    }
  })[0]


  const locations = useEntityQuery([ Has(SceneComponent), Has(NameComponent), Has(SummaryComponent), Has(ImageComponent) ]).map((entity) => {
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


  const characters = useEntityQuery([ Has(CharacterComponent), Not(PlayerComponent), Has(LocationComponent) ])
    .filter((entity) => {
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


  // Interactions happening in the player's location
  const interactions = useEntityQuery([ Has(InteractComponent) ])
    .filter((entity) => {
      return inPlayersLocation(entity)
    })
    .map((entity) => {
      const interaction = getComponentValueStrict(InteractComponent, entity)
      const name = getComponentValueStrict(NameComponent, entity)
      const summary = getComponentValueStrict(SummaryComponent, entity)
      const image = getComponentValueStrict(ImageComponent, entity)
      const alive = getComponentValue(AliveComponent, entity)
      return {
        entity: {
          entity,
          name: name.value,
          summary: summary.value,
          image: image.value,
          alive: alive?.value ?? false
        },
        initialActions: interaction.initialActions,
        initialMsg: interaction.initialMsg,
        participants: defaultAbiCoder.decode([ 'bytes32[]' ], interaction.participants),
      }
    })

  // Current interaction the player is involved in
  const currentInteraction = useEntityQuery([ Has(InteractComponent) ])
    .filter((entity) => {
      const interaction = getComponentValueStrict(InteractComponent, entity)
      const result = defaultAbiCoder.decode([ 'bytes32[]' ], interaction.participants)
      if (result[0].length == 0) return false
      const currentInteraction = result
        .map(participant => hexDataSlice(participant[0], 12))
        .find(participant => {
          console.log({
            participant,
            playerEntity

          })
          return participant == playerEntity
        })
      return currentInteraction != null
    })
    .map((entity) => {
      const interaction = getComponentValueStrict(InteractComponent, entity)
      const name = getComponentValueStrict(NameComponent, entity)
      const summary = getComponentValueStrict(SummaryComponent, entity)
      const image = getComponentValueStrict(ImageComponent, entity)
      const alive = getComponentValue(AliveComponent, entity)
      const otherParticipants = ethers.utils.defaultAbiCoder.decode([ 'bytes32[]' ], interaction.participants)
        .filter(entity => hexDataSlice(entity[0], 12) != playerEntity)
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
        entity: {
          entity,
          name: name.value,
          summary: summary.value,
          image: image.value,
          alive: alive?.value ?? false
        },
        initialActions: interaction.initialActions,
        initialMsg: interaction.initialMsg,
        otherParticipants: otherParticipants,
      }
    })[0]


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

  const paths = useEntityQuery([ Has(PathComponent), Has(PathLocationComponent), Has(NameComponent), Has(SummaryComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false
      const pathLocation = getComponentValueStrict(PathLocationComponent, entity)
      const currentLocation = getComponentValue(LocationComponent, playerEntity)
      if (!currentLocation) return false
      if (pathLocation.location0 != currentLocation.value) return false
    })
    .map((entity) => {
      const name = getComponentValueStrict(NameComponent, entity)
      const summary = getComponentValueStrict(SummaryComponent, entity)
      return {
        entity,
        name,
        summary,
      }
    })

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

