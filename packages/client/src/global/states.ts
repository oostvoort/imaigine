import { atom } from 'jotai'

export const activeScreen_atom = atom<
  'startingScreen' |
  'createAvatarScreen' |
  'currentLocationScreen'
>('createAvatarScreen')

export const currentLoader_atom = atom<
  'loadingAvatar' |
  'loadingStory'
>('loadingAvatar')
