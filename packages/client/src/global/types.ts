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
  locationId: PromiseOrValue<string> // represent bytes32
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
