import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { BattleOptions } from '@/hooks/minigame/types/battle'

type HashOptionsTypes = {key : string, data : BattleOptions, timestamp : number}

export const hash_options_value = atomWithStorage<HashOptionsTypes>('hash_options_value', {
  key : '',
  data : BattleOptions.NONE,
  timestamp : 0
})

export const hash_options_set_value = atom(
  null,
  (_, set, hashOptions: HashOptionsTypes) => {
    set(hash_options_value, {
      key : hashOptions.key,
      data : hashOptions.data,
      timestamp : hashOptions.timestamp
    })
  }
)

export const countdown_atom = atom<number>(10)
