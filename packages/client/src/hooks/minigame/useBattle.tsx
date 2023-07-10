import { useMUD } from '@/MUDContext'
import { Entity } from '@latticexyz/recs'
import { useComponentValue } from "@latticexyz/react"

export default function useBattle(playerId: Entity) {
  const {
    components: {
      BattleComponent,
    }
  } = useMUD()

  const battleData = {
    battle: useComponentValue(BattleComponent, playerId)
  }

  return {
    battleData
  }
}
