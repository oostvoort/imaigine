export interface GenerateStoryProps {
  theme: string,
  races: Array<string>,
  currency: string,
  extraDescriptions?: Array<string>,
}

export interface GenerateStoryResponse extends JsonResponse {
  visualSummary?: string
}

export interface GenerateLocationProps {
  story: Summarized,
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
  characterStats: CharacterStats,
  location: Summarized,
  story: Summarized,
}

export interface GeneratePlayerCharacterResponse extends Summarized, Entity {
  initialMessage: string,
  closingMessage: string,
  visualSummary: string,
  imageHash: string
}

export interface JsonResponse {
  name: string,
  summary: string,
}

export interface GenerateLocationResponse extends JsonResponse {
  imageHash: string
}

export interface GeneratePathResponse extends JsonResponse {
  imageHash?: string
}


export interface GeneratePathProps {
  story: GenerateStoryResponse
  toLocation: Summarized,
  fromLocation: Summarized,
}

export interface Entity extends Summarized {
  isAlive: boolean
}

export interface GenerateInteractionProps {
  activeEntity: Entity,
  otherEntities: Entity[],
  logHash: string,
  action: string
}

export interface InventoryChange {
  itemsAdded: string[],
  itemsRemoved: string[]
}

export interface GenerateInteractionParams {
  activeEntitySummary: Entity,
  otherEntitySummaries: Entity[],
  log: string[],
  action: string
}

export interface GenerateInteractionResponse extends Summarized {
  logHash: string,
  dialog: string,
  currencyChange: number,
  inventoryChange: InventoryChange
}

export interface GenerateTravelProps {
  storySummary: string,
  pathSummary: string,
  playerSummary: string
}

export interface GenerateTravelResponse extends JsonResponse {
  todo?: boolean
}
