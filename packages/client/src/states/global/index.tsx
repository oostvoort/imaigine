import { atom } from 'jotai'

export enum SCREENS {
  TITLE,
  CREATE_AVATAR,
  CURRENT_LOCATION,
  WORLD_MAP,
  TEST
}

export const activeScreen_atom = atom<number>(SCREENS.CREATE_AVATAR)

export const currentLoader_atom = atom<
  'loadingAvatar' |
  'loadingStory'
>('loadingAvatar')
