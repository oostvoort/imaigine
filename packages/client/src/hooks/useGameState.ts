import usePlayer from '@/hooks/v1/usePlayer'
import { SCREENS } from '@/states/global'


const useGameState = () => {
  const { player } = usePlayer()

  if (!player.player) return SCREENS.TITLE
  else return SCREENS.CURRENT_LOCATION
}

export default useGameState
