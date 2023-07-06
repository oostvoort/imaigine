import { useEntityQuery } from '@latticexyz/react'
import { getComponentValueStrict, Has, HasValue, runQuery } from '@latticexyz/recs'
import { getFromIPFS } from '@/global/utils'
import { useMUD } from '@/MUDContext'
import { useQuery } from '@tanstack/react-query'

export const useGetNpc = (locationId?: string) => {
  const {
    components: {
      ConfigComponent,
      CharacterComponent,
      AliveComponent,
      ImageComponent,
      LocationComponent,
      InteractionTypeComponent
    },
  } = useMUD()

  return useQuery(['npc'], async () => {
    if (!locationId) throw new Error("No location id")
    if (locationId == undefined) throw new Error("Undefined location id")
    const npcEntityIds = runQuery([
      Has(ConfigComponent),
      Has(CharacterComponent),
      Has(AliveComponent),
      Has(ImageComponent),
      Has(LocationComponent),
      Has(InteractionTypeComponent)
    ]).values()

    const npcData = Array.from(npcEntityIds).map(async (entityId) => {
      const config = getComponentValueStrict(ConfigComponent, entityId).value
      const configData = await getFromIPFS(config)
      const result = await configData.json()

      return {
        npcId: entityId,
        config: {
          value: config,
          ...result
        },
        image: getComponentValueStrict(ImageComponent, entityId).value
      }
    })

    return await Promise.all(npcData)
  },{
    enabled: Boolean(locationId)
  })
}
