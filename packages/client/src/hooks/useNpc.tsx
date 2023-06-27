import { useMutation } from 'react-query'
import { SERVER_API } from '@/global/constants'
import { GeneratedNpc, GenerateNpc, GenerateNpcProps, GenerateNpcResponse } from '@/global/types'
import { getFromIPFS } from '@/global/utils'
import { useMUD } from '@/MUDContext'
import { useComponentValue } from "@latticexyz/react"
import { awaitStreamValue } from '@latticexyz/utils'

export default function useNpc() {

  const {
    components: {
      ConfigComponent,
      CharacterComponent,
      AliveComponent,
      ImageComponent,
      LocationComponent,
      InteractionTypeComponent,
    },

    network: {
      worldSend,
      txReduced$,
      singletonEntity
    }
  } = useMUD()

  const npc = {
    config: useComponentValue(ConfigComponent, singletonEntity),
    character: useComponentValue(CharacterComponent, singletonEntity),
    alive: useComponentValue(AliveComponent, singletonEntity),
    image: useComponentValue(ImageComponent, singletonEntity),
    location: useComponentValue(LocationComponent, singletonEntity),
    interactionType: useComponentValue(InteractionTypeComponent, singletonEntity),
  }

  const generateNpc = useMutation<Awaited<GeneratedNpc>, Error, GenerateNpcProps>(async (data) => {
    const response = await fetch(`${SERVER_API}/api/v1/generate-npc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json() as GenerateNpcResponse;

    const ipfsData = await getFromIPFS(responseData.ipfsHash);

    const ipfsDataJson = await ipfsData.json();

    return { ...responseData, ...ipfsDataJson };

  }, {
    mutationKey: ["generateNpc"],
  })

  const createNpc = useMutation<typeof npc, Error, GenerateNpc>(async (data) => {
    const { config, imgHash, locationIpfsHash } = data
    const tx = await worldSend('createCharacter', [config, imgHash, locationIpfsHash])
    await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
    return npc
  }, {
    mutationKey: ["createNpc"],
  })

  return {
    npc,
    generateNpc,
    createNpc
  }
}
