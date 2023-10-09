import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { BATTLE_OPTIONS } from '@/hooks/minigame/types/battle'

type HashOptionsTypes = {key : string, data : BATTLE_OPTIONS, timestamp : number}

export const hash_options_value = atomWithStorage<HashOptionsTypes>('hash_options_value', {
  key : '',
  data : BATTLE_OPTIONS.NONE,
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
