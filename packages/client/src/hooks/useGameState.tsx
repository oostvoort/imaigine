import usePlayer from '@/hooks/v1/usePlayer'
import { activeScreen_atom, SCREENS } from '@/states/global'
import { useAtomValue } from 'jotai'


const useGameState = () => {
  const { player } = usePlayer()
  const activeScreen = useAtomValue(activeScreen_atom)
  if (player.travel?.status ?? 0 >= 2) return SCREENS.TRAVELLING
  else if (!player.player || activeScreen === SCREENS.WORLD_MAP || activeScreen === SCREENS.MINIGAME || activeScreen === SCREENS.TRAVELLING) return activeScreen

  else return SCREENS.CURRENT_LOCATION
}

export default useGameState
