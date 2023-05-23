import { useQuery } from '@tanstack/react-query'
import useGame from './useGame'

export default function usePlayerExisting() {
  const { player } = useGame()

  return useQuery({
    queryKey: ['is-player-existing', player],
    queryFn: async () => {
      return !!player
    },
    staleTime: Infinity
  })
}
