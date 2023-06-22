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
