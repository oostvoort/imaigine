export interface Story {
  name: string,
  description: string
}
export interface GenerateStoryProps {
  theme: string,
  races: string[],
  currency: string
}
export interface GenerateStoryResponse {
  name: string,
  description: string
}
export interface GenerateLocationProps {
  id: number,
}
export interface GenerateLocationResponse {
  ipfsHash: string,
  imageHash: string,
}
export interface InteractionOption {
  choice: string,
  effect: string
}
export interface InteractSingleDoneProps {
  locationIpfsHash: string,
  locationId: string,
  playerIpfsHash: string,
  npcIpfsHash: string,
  option?: {
    scenario: string,
    interaction: InteractionOption
  }
}
export interface InteractSingleDoneResponse {
  scenario: string,
  options: {
    good: InteractionOption,
    evil: InteractionOption,
    neutral: InteractionOption
  }
}
export interface GenerateNpcProps {
  locationIpfsHash: string,
}
export interface GenerateNpcResponse {
  ipfsHash: string,
  imageHash: string,
}
export interface GeneratePlayerProps {
  ageGroup: string,
  genderIdentity: string,
  race: string,
  skinColor: string,
  bodyType: string,
  favColor: string
}
export interface GeneratePlayerResponse {
  ipfsHash: string
  imgHashes: string[],
  locationId: string
}
export interface StoreToIPFS {
  json: any
}
export interface Based {
  name: string,
  summary: string
}
export interface StoryConfig {
  name: string,
  summary: string,
  theme: string,
  currency: string,
  races: string[]
}
export interface StartingLocation {
  config: string,
  imgHash: string,
  id: string
}
export interface BaseConfig {
  storyConfig: string,
  startingLocations: Array<StartingLocation>
}
