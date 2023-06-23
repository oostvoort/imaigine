import { useMutation } from 'react-query'
import { SERVER_API } from '@/global/constant'
import { GeneratedNpc, GenerateNpcProps, GenerateNpcResponse } from '@/global/types'
import { getFromIPFS } from '@/global/utils'

export default function useNpc() {

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

  return {
    generateNpc,
  }
}
