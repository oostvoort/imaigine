import { useMUD } from '../MUDContext'
import { useEntityQuery } from '@latticexyz/react'
import {
  getComponentValueStrict,
  getComponentValue,
  Has,
  runQuery,
  HasValue,
  Not,
  Entity,
  getEntitiesWithValue,
} from '@latticexyz/recs'
import { hexStripZeros, hexValue } from 'ethers/lib/utils'

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
      if (!playerEntity) return false
      const location = getComponentValueStrict(LocationComponent, entity)
      const currentLocation = getComponentValueStrict(LocationComponent, playerEntity)
      if (location != currentLocation) return false
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


  const otherPlayers = useEntityQuery([ Has(PlayerComponent) ])
    .filter((entity) => {
      if (!playerEntity) return false
      if (entity != playerEntity) return false
      const location = getComponentValueStrict(LocationComponent, entity)
      const currentLocation = getComponentValueStrict(LocationComponent, playerEntity)
      if (location != currentLocation) return false
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


  return {
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

