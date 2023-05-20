import {executePrompt} from "../executePrompt";
import {AIWorld} from "./generateWorld";
import {AICharacter} from "./generateCharacter";
import {JsonResponse} from "../types";

export interface AILocation {
    name: string,
    description: string,
    characters: Array<AICharacter>,
    items: Array<string>,
}

export interface GenerateLocationProps {
    world: { name: string, description: string },
    biome: string,
    naturalResources: string,
    wealthLevel: string,
    populationSize: string,
    safetyLevel: string,
}


export async function generateLocation({
                                           biome,
                                           naturalResources,
                                           populationSize,
                                           safetyLevel,
                                           wealthLevel,
                                           world
                                       }: GenerateLocationProps): Promise<JsonResponse> {
    const prompt = `    
    Given the following world description:
    "${world.description}"
    Generate a 3 paragraph description of a location in ${world.name}.
    Describe it's history within the world.

    Give it a name.
    
    And must have the following features:
    It is in a ${biome} biome.    
    It has a lot of ${naturalResources}
    It's population size is ${populationSize}
    It's safety level is ${safetyLevel}
    It's wealth level is ${wealthLevel}
    
    Output as a JSON object in this format:
    {
        "name": "the name of the location",
        "description": "the generated description"
    }
    `;


    return JSON.parse(await executePrompt(prompt)) as JsonResponse;
}