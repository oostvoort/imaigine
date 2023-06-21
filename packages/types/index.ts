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
  id: string,
  story: Story
}
export interface GenerateLocationResponse {
  name: string,
  description: string,
  imageHash: string
}
export interface GenerateNpcProps {
  id: string,
  description: string,
  story: Story
}
export interface GenerateNpcResponse {
  name: string,
  description: string,
  imageHash: string,
  initialMessage: string
}
export interface GeneratePlayerProps {
  story: Story,
  ageGroup: string,
  genderIdentity: string,
  race: string,
  skinColor: string,
  bodyType: string,
  favColor: string
}
export interface GeneratePlayerResponse {
  name: string,
  description: string,
  imageHashes: string[],
  locationId: string
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