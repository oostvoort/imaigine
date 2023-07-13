import { useQuery } from '@tanstack/react-query'
import { SERVER_API } from '@/global/constants'
import { PlayerHistoryProps } from '../../../../types'

interface PlayerHistory {
  history: string
}
async function getHistory(playerEntityId: string): Promise<PlayerHistory | undefined> {
  try {
    const response = await fetch(`${SERVER_API}/api/v1/get-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerEntityId: playerEntityId } as PlayerHistoryProps),
    });

    return await response.json() as {history: string}

  } catch (e) {
    console.error(e)
    return undefined
  }
}

export const useGetPlayerHistory = (playerEntityId?: string) => {
  if (!playerEntityId) throw new Error('No Player Entity ID')
  return useQuery([`player-history-${playerEntityId}`], async () => {
    if(playerEntityId === undefined) throw new Error("Undefined playerEntityId")
    if(!playerEntityId) throw new Error("No player entity id!")
    const playerHistory = await getHistory(playerEntityId)

    if(playerHistory === undefined) {
      throw new Error("Something went wrong!")
    } else {
      return playerHistory.history
    }
  }, {
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    cacheTime: 1000 * 60 * 2,
    staleTime: 1000 * 60 * 5
  })
}
