import {PromiseOrValue} from "contracts/types/ethers-contracts/common";

export interface CreateStoryTypes {
    name: PromiseOrValue<string>,
    summary: PromiseOrValue<string>,
    theme: PromiseOrValue<string>,
    races: Array<PromiseOrValue<string>>
    currency: PromiseOrValue<string>
}

export interface CreateLocationTypes {
   name: PromiseOrValue<string>,
   summary: PromiseOrValue<string>,
   imgHash: PromiseOrValue<string>
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

export interface GeneratedPlayer extends GeneratePlayerResponse{
  description: string
  name: string
}

export type GeneratePlayer = {
  config: PromiseOrValue<string>,
  imgHash: PromiseOrValue<string>,
  locationId: PromiseOrValue<string> // represent bytes32
}

export interface GenerateLocationProps {
  id: number
}

export interface GenerateLocationResponse {
  ipfsHash: string,
  imageHash: string
}

export interface GeneratedLocation extends GenerateLocationResponse {
  name : string
  summary: string
}

export type GenerateLocation = {
  config: PromiseOrValue<string>,
  imgHash: PromiseOrValue<string>,
  locationNumber: PromiseOrValue<string> // represent bytes32
}

export interface GenerateNpcProps {
  locationIpfsHash: string
}

export interface GenerateNpcResponse {
  ipfsHash: string
  imageHash : string
}

export interface GeneratedNpc extends GenerateNpcResponse {
  name: string
  summary: string
}

export type GenerateNpc = {
  config: PromiseOrValue<string>,
  imgHash: PromiseOrValue<string>,
  locationIpfsHash: PromiseOrValue<string>
}

export interface GenerateStoryProps {
  theme: string,
  races: Array<string>,
  currency: string
}

export interface GenerateStoryResponse {
  name: string,
  description: string,
}

// TODO: add types for generate story props for useStory hook
// start here
// <! close >

export interface GenerateLocationInteractionProps {
  locationIpfsHash: string,
  locationId: string,
  playerIpfsHash: string,
  npcIpfsHashes: Array<string>,
  options: Partial<{
    scenario: string,
    interaction: {
      choide: string,
      effect: string
    }
  }>
}

export interface GenerateLocationInteractionResponse {
  scenario: string,
  options: {
    good: string,
    evil: string,
    neutral: string
  }
}

export type GenerateLocationInteraction = {
  interactableId: PromiseOrValue<string>,
  choiceId: PromiseOrValue<string>
}
