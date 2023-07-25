import { useMUD } from '@/MUDContext'
import { useMutation, useQuery } from '@tanstack/react-query'
import { GenerateNpcProps, GenerateNpcResponse } from '../../../../types'
import { SERVER_API } from '@/global/constants'
import { getComponentValueStrict, Has, HasValue, runQuery } from '@latticexyz/recs'
import { getFromIPFS } from '@/global/utils'
import { LocationParam } from '@/global/types'

export default function useNpc(locationId?: LocationParam) {
  const {
    components: {
      ConfigComponent,
      CharacterComponent,
      AliveComponent,
      ImageComponent,
      LocationComponent,
      InteractionTypeComponent,
    },
  } = useMUD()

  const npc = useQuery(['npc'], async () => {
    if (!locationId) throw new Error("No location id")
    if (locationId == undefined) throw new Error("Undefined location id")
    const npcEntityIds = runQuery([
      Has(ConfigComponent),
      Has(CharacterComponent),
      Has(AliveComponent),
      Has(ImageComponent),
      HasValue(LocationComponent, { value: locationId as string }),
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

  const generateNPC = useMutation({
    mutationKey: [ 'generate-npc' ],
    mutationFn: async (variables: GenerateNpcProps) => {
      console.info('PROPS:', variables)

      try {
        const response = await fetch(`${SERVER_API}/api/v1/generate-npc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...variables }),
        });

        const data = await response.json()
        return {
          ipfsHash: data.ipfsHash,
          imageHash: data.imageHash,
        } as GenerateNpcResponse
      } catch (error) {
        console.error('[generateNPC]', generateNPC)
      }
    },
    retry: 5,
    retryDelay: 1000,
    onSuccess: () => {
      console.info('NPC Created Successfully!')
    },
    onError: (err) =>  console.error(err),
  })

  return {
    npc,
    generateNPC,
  }
}
