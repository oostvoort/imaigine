import usePlayer from '@/hooks/v1/usePlayer'
import { activeScreen_atom, SCREENS } from '@/states/global'
import { useAtomValue } from 'jotai'
import { useMUD } from '@/MUDContext'
import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'ethers'
import { Entity } from '@latticexyz/recs'
import { useComponentValue } from '@latticexyz/react'
import useBattle from '@/hooks/minigame/useBattle'
import { HEX_ZERO } from '@/global/constants'


const useGameState = () => {
  const {
    network: {
      playerEntity,
      worldContract,
    },
    components: {
      PlayerComponent,
      BattleQueueComponent,
    },
  } = useMUD()

  // used to figure out if it's been hooked up or not
  const query = useQuery(
    {
      queryKey: [ 'gameStateChecker' ],
      queryFn: async () => BigNumber.from(1).eq((await worldContract.getField(PlayerComponent.metadata.contractId, [ playerEntity as Entity ], 0))),
      staleTime: Infinity,
    },
  )

  const { player } = usePlayer()
  const { battleData } = useBattle(player.id as Entity)
  const activeScreen = useAtomValue(activeScreen_atom)

  const data = useComponentValue(BattleQueueComponent, player.location?.value as Entity)

  let overrideState
  if (battleData.battle && battleData.battle.opponent != HEX_ZERO) {
    overrideState = SCREENS.MINIGAME
  } else if (data?.playerId === player.id) { // implicitly say battle.opponent is HEX_ZERO
    overrideState = SCREENS.MINIGAME
  }

  // console.log("minigame battleData.battle", battleData.battle);
  // console.log("minigame data?.playerId", battleData);
  // console.log("minigame condition 1", battleData.battle && battleData.battle.opponent != HEX_ZERO);
  // console.log("minigame condition 2", data?.playerId === player.id);
  // console.log('minigame overrideState', overrideState)
  // console.log('minigame lockIn', lockIn.isLoading)


  if (query.isLoading || (query.data && !player.player)) return SCREENS.LOADING
  // else if (player.travel?.status ?? 0 >= 2) return SCREENS.TRAVELLING
  else if (
    !player.player ||
    activeScreen === SCREENS.WORLD_MAP ||
    activeScreen === SCREENS.MINIGAME ||
    activeScreen === SCREENS.TRAVELLING
  ) return activeScreen
  else return overrideState ?? SCREENS.CURRENT_LOCATION
}

export default useGameState
