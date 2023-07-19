import usePlayer from '@/hooks/v1/usePlayer'
import { activeScreen_atom, SCREENS } from '@/states/global'
import { useAtomValue } from 'jotai'
import { useMUD } from '@/MUDContext'
import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'ethers'
import { Entity } from '@latticexyz/recs'


const useGameState = () => {
  const {
    network: {
      playerEntity,
      worldContract
    },
    components: {
      PlayerComponent
    },
  } = useMUD()


  // used to figure out if it's been hooked up or not
  const query = useQuery(
    {
      queryKey: ['gameStateChecker'],
      queryFn: async () => BigNumber.from(1).eq((await worldContract.getField(PlayerComponent.metadata.contractId, [playerEntity as Entity], 0))),
      staleTime: Infinity
    }
  )

  const { player } = usePlayer()
  const activeScreen = useAtomValue(activeScreen_atom)

  if (query.isLoading || (query.data && !player.player)) return SCREENS.LOADING
  else if (player.travel?.status ?? 0 >= 2) return SCREENS.TRAVELLING
  else if (
    !player.player ||
    activeScreen === SCREENS.WORLD_MAP ||
    activeScreen === SCREENS.MINIGAME ||
    activeScreen === SCREENS.TRAVELLING
  ) return activeScreen
  else return SCREENS.CURRENT_LOCATION
}

export default useGameState
