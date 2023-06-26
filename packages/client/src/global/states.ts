import { atom } from 'jotai'

export const activeScreen_atom = atom<
  'startingScreen' |
  'createAvatarScreen' |
  'currentLocationScreen'
>('startingScreen')

export const currentLoader_atom = atom<
  'loadingAvatar' |
  'loadingStory'
>('loadingAvatar')
