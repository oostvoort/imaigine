import { atom } from 'jotai'
import { InteractNpcResponse } from '../../../../types'

export enum SCREENS {
  TITLE,
  CREATE_AVATAR,
  CURRENT_LOCATION,
  WORLD_MAP,
  TRAVELLING,
  TEST
}

export const activeScreen_atom = atom<number>(SCREENS.CURRENT_LOCATION)

export const currentLoader_atom = atom<
  'loadingAvatar' |
  'loadingStory'
>('loadingAvatar')

export const npcConversation_atom = atom<InteractNpcResponse>({} as InteractNpcResponse)

export const currentLocation_atom = atom<any>({} as any)
