import React from 'react'
import { useMUD } from '@/MUDContext'
import { Entity, getComponentValueStrict, Has, runQuery } from '@latticexyz/recs'
import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { getFromIPFS } from '@/global/utils'
import { useComponentValue } from '@latticexyz/react'

export default function useGetNPCPlayers(npcId?: string) {
  const {
    components: {
      MultiInteractionComponent,
      ConfigComponent,
      ImageComponent,
    },
  } = useMUD()

  const npcEntityId = useQuery(
    ['npc-entity-id'],
    () => {
      if (!npcId) throw new Error('Unknown NPC!')
      const npcIds = runQuery([
        Has(MultiInteractionComponent)
      ]).values()

      return  Array.from(npcIds).find((entityId) => entityId === npcId)
    }, {
      enabled: Boolean(npcId),
      refetchOnWindowFocus: false,
    }
  )

  const playersBytes = useComponentValue(MultiInteractionComponent, npcEntityId.data)?.players

  const [decodedPlayersEntityInBytes] = ((playersBytes && playersBytes !== '0x' ? ethers.utils.defaultAbiCoder.decode(
    [ 'bytes32[]' ],
    playersBytes,
  ) : [[]]))

  const playersData = useQuery({
    queryKey: ['query-configs', decodedPlayersEntityInBytes],
    queryFn: async () => {
     const toReturn = decodedPlayersEntityInBytes.map(async (playerEntityId: Entity) => {
       const config = getComponentValueStrict(ConfigComponent, playerEntityId)
       const result = await getFromIPFS(config.value)
       const data = await result.json()

       return {
         playerEntityId,
         config,
         name: data.name,
         image: getComponentValueStrict(ImageComponent, playerEntityId),
       }
     })

      return await Promise.all(toReturn)
    },
    enabled: !!decodedPlayersEntityInBytes.length,
    refetchOnWindowFocus: false,
  })

  return { playersData }
}
