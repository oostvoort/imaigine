import { useQuery } from '@tanstack/react-query'
import { getFromIPFS } from '@/global/utils'
import usePlayer from '@/hooks/usePlayer'
import useBattle from '@/hooks/minigame/useBattle'
import { Entity } from '@latticexyz/recs'

export default function useGetFromIPFS(ipfsHash: string, key?: 'opponent' | 'player') {
  const { player } = usePlayer()
  const { playerInfo, opponentInfo } = useBattle(player.id as Entity)

  return useQuery(
    {
      queryKey: [ 'ipfs', ipfsHash, key ],
      queryFn: async () => await (await getFromIPFS(ipfsHash)).json() as {
        name: string,
        description: string,
        battlePoints: number,
        image: string,
        battleWinResult: number,
        battleLossResult: number,
      },
      enabled: !!ipfsHash,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      select: data => {
        const userInfo = key == 'player' ? playerInfo : opponentInfo

        return {
          ...data,
          image: userInfo.image?.value ?? '',
          battlePoints: Number(userInfo.battlePoints?.value ?? '0'),
          battleWinResult: Number(userInfo.battleResults?.totalWins ?? '0'),
          battleLossResult: Number(userInfo.battleResults?.totalLoses ?? '0'),
        }
      },
    },
  )
}
