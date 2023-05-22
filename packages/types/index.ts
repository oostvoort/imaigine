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

export interface GeneratePlayerCharacterResponse {
  name: string,
  summary: string,
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

export interface GenerateInteractionProps {
  activeEntitySummary: string,
  otherEntitySummaries: string[],
  logHash: string,
  action: string
}

export interface GenerateInteractionResponse extends JsonResponse {
  todo: boolean
}

export interface GenerateTravelProps {
  storySummary: string,
  pathSummary: string,
  playerSummary: string
}

export interface GenerateTravelResponse extends JsonResponse {
  todo?: boolean
}
