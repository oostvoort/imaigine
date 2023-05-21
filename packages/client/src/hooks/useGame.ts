import { useMUD } from '../MUDContext'
import { useEntityQuery } from '@latticexyz/react'
import { getComponentValueStrict, Has } from '@latticexyz/recs'

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
      StoryComponent
    },
    network: { playerEntity, singletonEntity },
    systemCalls,
  } = useMUD()

  const story = useEntityQuery([Has(StoryComponent)]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const summary = getComponentValueStrict(SummaryComponent, entity)
    return {
      entity,
      name,
      summary,
    }
  })[0]

  const locations = useEntityQuery([ Has(PathLocationComponent)]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const summary = getComponentValueStrict(SummaryComponent, entity)
    return {
      entity,
      name,
      summary,
    }
  })

  const characters = useEntityQuery([ Has(CharacterComponent) ]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const summary = getComponentValueStrict(SummaryComponent, entity)
    return {
      entity,
      name,
      summary,
    }
  })

  const players = useEntityQuery([ Has(PlayerComponent) ]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const summary = getComponentValueStrict(SummaryComponent, entity)
    return {
      entity,
      name,
      summary,
    }
  })


  return {
    story,
    locations,
    characters,
    players,
  }
}

