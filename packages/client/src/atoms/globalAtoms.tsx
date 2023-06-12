import { atom } from 'jotai'
import { Entity, getComponentValueStrict, Type } from '@latticexyz/recs'

// indicator of what page to render to the client
export const activePage_atom = atom<'create' | 'game' | 'welcome' | 'loading' | 'dev' | 'choose-avatar' | 'test' | 'gameplay'>('gameplay')
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



// All about game

export const startingLocation_atom = atom<Entity | null>(null)

export const otherLocations_atom = atom<Array<Entity> | null>(null)

export const charactersEntities_atom = atom<Array<Entity> | null>(null)

export const itemsEntities_atom = atom<Array<Entity> | null>(null)
















