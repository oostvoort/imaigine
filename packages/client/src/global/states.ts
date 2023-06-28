import { atom } from 'jotai'

export const activeScreen_atom = atom<
  'startingScreen' |
  'createAvatarScreen' |
  'currentLocationScreen' |
  'travelScreen'
>('currentLocationScreen')

export const currentLoader_atom = atom<
  'loadingAvatar' |
  'loadingStory'
>('loadingAvatar')
