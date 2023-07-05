import { useMUD } from '@/MUDContext'
import { useEntityQuery, useRows } from '@latticexyz/react'
import { Has, getComponentValueStrict } from '@latticexyz/recs'
import React from 'react'
import { getFromIPFS } from '@/global/utils'

export const usePlayers = () => {
  const {
    components: {
      PlayerComponent,
      ConfigComponent,
      CharacterComponent,
      AliveComponent,
      ImageComponent,
      LocationComponent,
      KarmaPointsComponent,
    },
  } = useMUD()

  const [ipfsData, setIPFSData] = React.useState(null)

  const players = useEntityQuery([
    Has(PlayerComponent),
    Has(ConfigComponent),
    Has(CharacterComponent),
    Has(AliveComponent),
    Has(ImageComponent),
    Has(LocationComponent),
    Has(KarmaPointsComponent),
  ]).map((entity) => {
    const player = getComponentValueStrict(PlayerComponent, entity)
    const config = getComponentValueStrict(ConfigComponent, entity)
    const character = getComponentValueStrict(CharacterComponent, entity)
    const alive = getComponentValueStrict(AliveComponent, entity)
    const image = getComponentValueStrict(ImageComponent, entity)
    const location = getComponentValueStrict(LocationComponent, entity)
    const karmaPoints = getComponentValueStrict(KarmaPointsComponent, entity)

    if (config.value && !ipfsData) {
      getFromIPFS(config.value)
        .then((response) => response.json())
        .then((result) => setIPFSData(result))
        .catch((error) => console.error('Error fetching data from IPFS:', error))
    }

    return {
      player,
      config: ipfsData,
      character,
      alive,
      image,
      location,
      karmaPoints,
    }
  })

  return {
    players,
  }
}
