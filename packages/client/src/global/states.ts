import { atom } from 'jotai'

{/*TODO: Remove wishPrompt after the demo*/}
export const activeScreen_atom = atom<
  'startingScreen' |
  'createAvatarScreen' |
  'currentLocationScreen' |
  'travelScreen'
>('startingScreen')

export const currentLoader_atom = atom<
  'loadingAvatar' |
  'loadingStory'
>('loadingAvatar')
