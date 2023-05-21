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
      DescriptionComponent,
    },
    network: { playerEntity },
    systemCalls,
  } = useMUD()


  // TODO: queries should be limited to player's current location

  const locations = useEntityQuery([ Has(LocationComponent) ]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const description = getComponentValueStrict(DescriptionComponent, entity)
    return {
      entity,
      name,
      description,
    }
  })

  const characters = useEntityQuery([ Has(CharacterComponent) ]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const description = getComponentValueStrict(DescriptionComponent, entity)
    return {
      entity,
      name,
      description,
    }
  })

  const players = useEntityQuery([ Has(PlayerComponent), Has(CharacterComponent) ]).map((entity) => {
    const name = getComponentValueStrict(NameComponent, entity)
    const description = getComponentValueStrict(DescriptionComponent, entity)
    return {
      entity,
      name,
      description,
    }
  })


  return {
    locations,
    characters,
    players
  }
}

