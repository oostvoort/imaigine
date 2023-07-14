import { atom } from 'jotai'
import { InteractNpcResponse } from '../../../../types'

export enum SCREENS {
  TITLE,
  CREATE_AVATAR,
  CURRENT_LOCATION,
  WORLD_MAP,
  TRAVELLING,
  MINIGAME,
  TEST
}

export const activeScreen_atom = atom<number>(SCREENS.TITLE)

export const currentLoader_atom = atom<
  'loadingAvatar' |
  'loadingStory'
>('loadingAvatar')

export const npcConversation_atom = atom<InteractNpcResponse>({} as InteractNpcResponse)

export const currentLocation_atom = atom<any>({} as any)

export const travelStory_atom = atom<{
  name: string,
  travelStory: string,
}>({
  name: '',
  travelStory: ''
})

export const myPlayerMarkerId_atom = atom<string | null>(null)

export const markerId_atom = atom<number | null>(null)
