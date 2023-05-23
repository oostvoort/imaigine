export interface GenerateStoryProps {
  mock?: boolean
  theme: string,
  races: Array<string>,
  currency: string,
  extraDescriptions?: Array<string>,
}

export interface GenerateStoryResponse extends Summarized {
  visualSummary?: string
}


export interface GenerateItemProps {
  mock?: boolean
  story: Summarized,
  name: string,
}

export interface GenerateItemResponse extends Summarized {
  value: number,
  imageHash: string
  visualSummary: string
  isAlive: boolean
  owner: string
}

export interface Logged {
  logHash: string
}


export interface GenerateLocationProps {
  mock?: boolean
  story: Summarized,
}

export interface GenerateLocationResponse extends Summarized {
  imageHash: string
  visualSummary: string
}

export interface CharacterStory {
  favColor: 'Green' | 'Brown' | 'Blue' | 'White' | 'Yellow' | 'Grey' | 'Red' | string
}

export interface CharacterPhysicalFeatures {
  ageGroup: string
  genderIdentity: string
  race: string
  bodyType: string
  height: string
  hairLength: string
  hairType: string
  hairColor: string
  eyeShape: string
  eyeColor: string
}

export type CharacterStat = keyof CharacterStats;

export interface CharacterStats {
  strength: string;
  dexterity: string;
  constitution: string;
  intelligence: string;
  charisma: string;
  wisdom: string;
}


export interface GeneratePlayerCharacterProps {
  mock?: boolean
  characterStats: CharacterStats,
  characterStory: CharacterStory,
  location: Summarized,
  story: Summarized,
  physicalFeatures: CharacterPhysicalFeatures,
}

export interface Summarized {
  name: string,
  summary: string
}

export interface GenerateNonPlayerCharacterProps {
  mock?: boolean
  characterStats: CharacterStats,
  location: Summarized,
  story: Summarized,
}

export interface GeneratePlayerCharacterResponse extends Summarized, Entity {
  initialMessage: string,
  visualSummary: string,
  imageHash: string,
}

export interface PossibleEffect {
  karmaChange: number,
  healthChange: number,
  currencyChange: number,
  inventoryChange: string,
}

export interface Possible {
  mode: 'dialog' | 'action',
  content: string,
  effect: PossibleEffect
}

export interface GeneratePlayerCharacterResponse extends Summarized, Entity {
  initialMessage: string,
  visualSummary: string,
  imageHash: string,
  possible: Possible[]
}

export interface JsonResponse {
  name: string,
  summary: string,
}


export interface GeneratePathResponse extends JsonResponse {
  imageHash?: string
}


export interface GeneratePathProps {
  mock?: boolean
  story: GenerateStoryResponse
  toLocation: Summarized,
  fromLocation: Summarized,
}

export interface Entity extends Summarized {
  isAlive: boolean
  owner?: string
  karma?: number
}

export interface GenerateInteractionProps {
  mode: 'location' | 'interactable'
  storySummary: string,
  location: Summarized,
  activeEntity: Entity,
  otherEntities: Entity[],
  logHash: string,
  action: string
}

export interface InventoryChange {
  itemsAdded: string[],
  itemsRemoved: string[]
}


export interface NextEvent {
  mode: 'action' | 'dialog',
  content: string
}

export interface GenerateInteractionResponse extends Summarized {
  logHash: string,
  possible: NextEvent[],
  currencyChange: number,
  inventoryChange: InventoryChange
}

export interface GenerateTravelProps {
  mock?: boolean
  storySummary: string,
  pathSummary: string,
  playerSummary: string
}

export interface GenerateTravelResponse extends JsonResponse {
  todo?: boolean
}
