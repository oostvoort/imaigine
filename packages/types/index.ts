export interface Dev {
  mock?: boolean
}

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

export interface GenerateLocationProps extends Dev {
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

export interface InteractSingleDoneResponse {
  scenario: string,
  options: {
    good: InteractionOption,
    evil: InteractionOption,
    neutral: InteractionOption
  }
}

export interface GenerateNpcProps extends Dev {
  locationIpfsHash: string,
  locationId: string
}

export interface GenerateNpcResponse {
  ipfsHash: string,
  imageHash: string,
}

export interface GeneratePlayerProps extends Dev {
  ageGroup: string,
  genderIdentity: string,
  race: string,
  skinColor: string,
  bodyType: string,
  favColor: string
}

export interface GeneratePlayerResponse {
  ipfsHash: string
  visualSummary: string,
  locationId: string,
  cellId: number
}

export interface GeneratePlayerImageProps extends Dev {
  visualSummary: string
}

export interface GeneratePlayerImageResponse {
  imageIpfsHash: string
}

export interface CreatePlayerProps extends Dev {
  playerId: string,
  ipfsHash: string,
  imageIpfsHash: string,
  locationId: string,
  cellId: number
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
  id: string,
  cell: number
}

export interface BaseConfig {
  storyConfig: string,
  startingLocations: Array<StartingLocation>
}

export interface InteractSQLResult {
  log_id: number,
  interactable_id: string,
  scenario: string,
  good_choice: string,
  good_effect: string,
  evil_choice: string,
  evil_effect: string,
  neutral_choice: string,
  neutral_effect: string
}

export interface InsertInteractionParams {
  interactable_id: string,
  scenario: string,
  good_choice: string,
  good_effect: string,
  evil_choice: string,
  evil_effect: string,
  neutral_choice: string,
  neutral_effect: string
}

export interface LogSqlResult {
  log_id: number,
  interactable_id: string,
  players: string,
  mode: string,
  by: string,
  player_log: string,
}

export interface InteractLocationProps extends Dev {
  playerEntityId: string,
  locationEntityId: string,
  locationIpfsHash: string,
  playerIpfsHash: string,
  npcIpfsHash: Array<string>,
}

export interface InteractNpcProps extends Dev {
  playerEntityId: Array<string>,
  playerIpfsHash: Array<string>,
  npcIpfsHash: string,
  npcEntityId: string,
}

export interface InteractNpcResponse {
  conversationHistory: Array<Conversation>,
  option: {
    good: {
      goodChoise: string,
      goodResponse: string
    },
    evil: {
      evilChoise: string,
      evilResponse: string
    },
    neutral: {
      neutralChoise: string,
      neutralResponse: string
    }
  }
}

export interface InsertHistoryLogsParams {
  interactable_id: string,
  players: string,
  mode: string,
  by: string,
  player_log: string
}

export interface Conversation {
  logId: number,
  by: string,
  text: string,
}

export interface GenerateTravelProps {
  playerEntityId: string
}

export interface GenerateTravelResponse {
  travelStory: string
}

export interface TravelLocationAttributes {
  locationName: string,
  latitude: string,
  longitude: string,
  type: string,
  precipitation: string,
  river: string,
  elevation: string,
  depth: string,
  temperature: string,
  biome: string,
}

export interface RouteObject {
  cell: number,
  latitude: string,
  longitude: string,
  area: string,
  type: string,
  precipitation: string,
  river: string,
  population: string,
  elevation: string,
  depth: string,
  temperature: string,
  biome: string,
  state: string,
  province: string,
  culture: string,
  religion: string,
  burg: string
}

export interface LocationObject {
  cellNumber: number,
  name: string
}

export interface PlayerHistoryProps {
  playerEntityId: string,
  locationId: string
}
