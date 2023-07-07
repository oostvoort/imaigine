import usePlayer from '@/hooks/v1/usePlayer'
import { activeScreen_atom, SCREENS } from '@/states/global'
import { useAtomValue } from 'jotai'


const useGameState = () => {
  const { player } = usePlayer()
  const activeScreen = useAtomValue(activeScreen_atom)

  if (!player.player || activeScreen === SCREENS.WORLD_MAP) return activeScreen
  else if (player.travel?.status ?? 0 > 1) return SCREENS.TRAVELLING
    //Todo: change this again
  else return SCREENS.MINIGAME
}

export default useGameState
