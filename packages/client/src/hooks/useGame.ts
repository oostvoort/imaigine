import { useMUD } from '../MUDContext'
import { useEntityQuery } from '@latticexyz/react'
import { getComponentValue, getComponentValueStrict, Has, Not } from '@latticexyz/recs'
import { hexValue, Interface } from 'ethers/lib/utils'
import { IWorld__factory } from 'contracts/types/ethers-contracts'

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
      InteractComponent
    },
    network: { playerEntity, singletonEntity },
    systemCalls,
  } = useMUD()

  const story = useEntityQuery([ Has(StoryComponent) ]).map((entity) => {
    const name = getComponentValue(NameComponent, entity) ?? ''
    const summary = getComponentValue(SummaryComponent, entity) ?? ''
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

      return {
        entity,
        name,
        summary,
        image,
      }
    })[0]

  const currentLocation = useEntityQuery([ Has(SceneComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false
      console.log(playerEntity)
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
    const name = getComponentValue(NameComponent, entity) ?? ''
    const summary = getComponentValue(SummaryComponent, entity) ?? ''
    const image = getComponentValue(ImageComponent, entity) ?? ''
    return {
      entity,
      name,
      summary,
      image,
    }
  })[0]


  const locations = useEntityQuery([ Has(SceneComponent) ]).map((entity) => {
    const name = getComponentValue(NameComponent, entity) ?? ''
    const summary = getComponentValue(SummaryComponent, entity) ?? ''
    const image = getComponentValue(ImageComponent, entity) ?? ''
    return {
      entity,
      name,
      summary,
      image,
    }
  })


  const characters = useEntityQuery([ Has(CharacterComponent), Not(PlayerComponent) ])
    .filter((entity) => {
      return inPlayersLocation(entity)
    })
    .map((entity) => {
      const name = getComponentValue(NameComponent, entity) ?? ''
      const summary = getComponentValue(SummaryComponent, entity) ?? ''
      const image = getComponentValue(ImageComponent, entity) ?? ''
      return {
        entity,
        name,
        summary,
        image,
      }
    })


  const interactions = useEntityQuery([ Has(InteractComponent) ])
    .filter((entity) => {
      return inPlayersLocation(entity)
    })
    .map((entity) => {
      const participants = getComponentValueStrict(InteractComponent, entity)
      // worldInterface.decodeFunctionData()
      return {
        entity,
        participants
      }
    })


  const otherPlayers = useEntityQuery([ Has(PlayerComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false
      if (entity == playerEntity) return false
      return inPlayersLocation(entity)
    })
    .map((entity) => {
      const name = getComponentValue(NameComponent, entity) ?? ''
      const summary = getComponentValue(SummaryComponent, entity) ?? ''
      const image = getComponentValue(ImageComponent, entity) ?? ''
      return {
        entity,
        name,
        summary,
        image,
      }
    })

  const paths = useEntityQuery([ Has(PathComponent), Has(PathLocationComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false

      const pathLocation = getComponentValueStrict(PathLocationComponent, entity)
      const currentLocation = getComponentValueStrict(LocationComponent, playerEntity)

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
    const location = getComponentValueStrict(LocationComponent, entity)
    const currentLocation = getComponentValueStrict(LocationComponent, playerEntity)
    return location.value == currentLocation.value
  }


  return {
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

