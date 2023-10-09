import { useQuery } from '@tanstack/react-query'
import { getFromIPFS } from '@/global/utils'

const useIpfs = <T>(ipfsHash: string, key?: string) => {
  return useQuery({
    queryKey: ['ipfs', ipfsHash, key],
    queryFn: async () => {
      const ipfsFile = await getFromIPFS(ipfsHash)
      return await ipfsFile.json() as T
    },
    enabled: !!ipfsHash,
    refetchOnWindowFocus: false
  })
}

export default useIpfs
