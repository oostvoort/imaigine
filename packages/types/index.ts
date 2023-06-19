export interface GenerateStoryProps {
  theme: string,
  races: string[]
}

export interface GenerateStoryResponse {
  name: string,
  description: string
}
export interface GenerateLocationProps {
  id: string
}

export interface GenerateLocationResponse {
  name: string,
  description: string,
  image: string
}

export interface PlayerAttributesProps {
  characterStats: CharacterStats,
  characterStory: CharacterStory,
  location: Summarized,
  story: Summarized,
  physicalFeatures: CharacterPhysicalFeatures,
}

export interface CharacterStats {
  strength: string;
  dexterity: string;
  constitution: string;
  intelligence: string;
  charisma: string;
  wisdom: string;
}

export interface CharacterStory {
  favColor: 'Green' | 'Brown' | 'Blue' | 'White' | 'Yellow' | 'Grey' | 'Red' | string
}

export interface Summarized {
  name: string,
  summary: string
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

export interface PlayerAttributesResponse {
  name: string,
  description: string,
  image: string
}

export interface GenerateNpcProps {
  id: string,
  description: string
}

export interface GenerateNpcResponse {
  name: string,
  description: string,
  image: string
}

export interface GenerateTravelProps {
  routeIds: string[],
  from: string,
  to: string
}

export interface GenerateTravelResponse {
  situation: string,
  playerHistory: string
}