import {PromiseOrValue} from "contracts/types/ethers-contracts/common";

export type RequestGenerateStory = {
    theme: string,
    races: Array<string>
}

export type ResponseGenerateStory = {
    name: string,
    description: string
}

export type RequestGenerateLocation = {
    id: string
}

export type ResponseGenerateLocation = {
    name: string,
    image: string,
    description: string
}

export type GenerateLocation = {
    name: PromiseOrValue<string>,
    summary: PromiseOrValue<string>,
    imgHash: PromiseOrValue<string>,
}

export type RequestGeneratePlayer = {
    attributes: Partial<object>
}

export type ResponseGeneratePlayer = ResponseGenerateStory & {
    image: Array<string>;
};

export type GeneratePlayer = {
    config: PromiseOrValue<string>,
    imgHash: PromiseOrValue<string>,
    locationId: PromiseOrValue<string> // represent bytes32
}


export type RequestGenerateNpc = {
    id: string,
    description: string
}

export type ResponseGenerateNpc = ResponseGenerateLocation

export type RequestGenerateTravel = {
   routeIds: Partial<Array<number>>,
   from: Partial<string | number>,
   to: Partial<string | number>
}

export type ResponseGenerateTravel = {
    situation: string,
    playerHistory: string,
};
