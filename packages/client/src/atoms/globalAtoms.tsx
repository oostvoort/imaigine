import { atom } from 'jotai'
import { Entity, getComponentValueStrict, Type } from '@latticexyz/recs'

// indicator of what page to render to the client
export const activePage_atom = atom<'create' | 'game' | 'welcome' | 'loading' | 'dev' | 'choose-avatar'>('choose-avatar')
export const selectedPath_atom = atom<{
  entity: Entity,
  name: ReturnType<typeof getComponentValueStrict<{ value: Type.String }, undefined>>,
  summary: ReturnType<typeof getComponentValueStrict<{ value: Type.String }, undefined>>,
  image: ReturnType<typeof getComponentValueStrict<{ value: Type.String }, undefined>>,
  pathLocations: any[]
} | null>(null)

export const selectedCharacter_atom = atom<{
  entity: Entity,
  name: ReturnType<typeof getComponentValueStrict<{ value: Type.String }, undefined>>,
  summary: ReturnType<typeof getComponentValueStrict<{ value: Type.String }, undefined>>,
  image: ReturnType<typeof getComponentValueStrict<{ value: Type.String }, undefined>>
} | null>(null)

export const triggerRender_atom = atom<number>(0)

export const isLoading_atom = atom<boolean>(false)
