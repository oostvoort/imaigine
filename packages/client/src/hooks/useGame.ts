import { useMUD } from '../MUDContext'
import { useEntityQuery } from '@latticexyz/react'
import { getComponentValue, Has, Not } from '@latticexyz/recs'

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
      ImageComponent
    },
    network: { playerEntity, singletonEntity },
    systemCalls,
  } = useMUD()

  const story = useEntityQuery([Has(StoryComponent)]).map((entity) => {
    const name = getComponentValue(NameComponent, entity) ?? ''
    const summary = getComponentValue(SummaryComponent, entity) ?? ''
    return {
      entity,
      name,
      summary,
    }
  })[0]

  const startingLocation = useEntityQuery([ Has(SceneComponent), Has(NameComponent), Has(SummaryComponent), Has(ImageComponent)]).map((entity) => {
    const name = getComponentValue(NameComponent, entity) ?? ''
    const summary = getComponentValue(SummaryComponent, entity) ?? ''
    const image = getComponentValue(ImageComponent, entity) ?? ''
    return {
      entity,
      name,
      summary,
      image
    }
  })[0]


  const locations = useEntityQuery([ Has(SceneComponent)]).map((entity) => {
    const name = getComponentValue(NameComponent, entity) ?? ''
    const summary = getComponentValue(SummaryComponent, entity) ?? ''
    const image = getComponentValue(ImageComponent, entity) ?? ''
    return {
      entity,
      name,
      summary,
      image
    }
  })

  const characters = useEntityQuery([ Has(CharacterComponent), Not(PlayerComponent) ]).map((entity) => {
    const name = getComponentValue(NameComponent, entity) ?? ''
    const summary = getComponentValue(SummaryComponent, entity) ?? ''
    const image = getComponentValue(ImageComponent, entity) ?? ''
    return {
      entity,
      name,
      summary,
      image
    }
  })

  const players = useEntityQuery([ Has(PlayerComponent) ]).map((entity) => {
    const name = getComponentValue(NameComponent, entity) ?? ''
    const summary = getComponentValue(SummaryComponent, entity) ?? ''
    const image = getComponentValue(ImageComponent, entity) ?? ''
    return {
      entity,
      name,
      summary,
      image
    }
  })


  return {
    startingLocation,
    story,
    locations,
    characters,
    players,
  }
}

