import { atom } from 'jotai'

export enum SCREENS {
  TITLE,
  CREATE_AVATAR,
  CURRENT_LOCATION,
  WORLD_MAP,
}

export const activeScreen_atom = atom<number>(SCREENS.CURRENT_LOCATION)

export const currentLoader_atom = atom<
  'loadingAvatar' |
  'loadingStory'
>('loadingAvatar')
