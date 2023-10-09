import { GeneratePlayerProps } from '@/global/types'

export const BACKGROUND_IMAGES = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg', 'bg6.jpg']
export const SERVER_API = import.meta.env.VITE_API_ENDPOINT ?? ''
export const IPFS_URL_PREFIX = import.meta.env.VITE_IPFS_URL_PREFIX

export const IS_MOCK = import.meta.env.VITE_MOCK === 'true'

export const HEX_ZERO = '0x0000000000000000000000000000000000000000000000000000000000000000'


export type SetupOptionType = Array<{
  label: string,
  store: keyof GeneratePlayerProps,
  options: Array<string>
}>

export const setupOptions1: SetupOptionType = [
  {
    label: 'Select your Age Group',
    store: 'ageGroup',
    options: [ 'child', 'adolescent', 'youngAdult', 'adult', 'elderly' ],
  },
  {
    label: 'Select your Gender Identity',
    store: 'genderIdentity',
    options: [ 'male', 'female', 'nonbinary', 'others' ],
  },
]

export const setupOptions2: SetupOptionType = [
  {
    label: 'Select your Race',
    store: 'race',
    options: [ 'human', 'elf', 'dwarf', 'orc', 'gnome', 'halfling' ],
  },
  {
    label: 'Skin Color',
    store: 'skinColor',
    options: [ 'light', 'tan', 'medium', 'dark', 'ebony' ],
  },
  {
    label: 'Select your Body Type',
    store: 'bodyType',
    options: [ 'slim', 'average', 'athletic', 'burly', 'plump' ],
  },
]

export const colorPalette = [
  {
    'bg-option-1': 'green',
  },
  {
    'bg-option-2': 'brown',
  },
  {
    'bg-option-3': 'blue',
  },
  {
    'bg-option-4': 'white',
  },
  {
    'bg-option-5': 'yellow',
  },
  {
    'bg-option-6': 'gray',
  },
  {
    'bg-option-7': 'red',
  },
]
