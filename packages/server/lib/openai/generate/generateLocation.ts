import {executePrompt} from "../executePrompt";
import {JsonResponse} from "../types";
import {CharacterStats} from "types";
import {getRandomValue} from "../utils";

export interface AILocation {
    name: string,
    summary: string,
    characters: Array<{
        name: string
        summary: string
        stats: CharacterStats,
        initialMessage: string
        closingMessage: string,
        imgHash: string
    }>,
    items: Array<string>,
    imgHash: string
}

export interface GenerateLocationProps {
    world: { name: string, summary: string },
}

const wealthLevels = ["Poor", "Lower Middle Class", "Middle Class", "Upper Middle Class", "Wealthy"];
const populationSizes = ["Small", "Medium", "Large", "Very Large", "Metropolis"];
const safetyLevels = ["Unsafe", "Moderately Safe", "Safe", "Very Safe", "Highly Secure"];
const biomes = ["Tropical Rainforest", "Temperate Forest", "Taiga", "Desert", "Savanna", "Grassland", "Tundra", "Mediterranean", "Chaparral", "Wetland", "Coral Reef", "Mountain", "Prairie", "Arctic", "Mangrove", "Steppe", "Boreal Forest", "Shrubland", "Swamp", "Estuary", "Salt Marsh", "Cave", "Volcano", "Oasis", "Canyon", "Plateau"];

export async function generateLocation({world,}: GenerateLocationProps): Promise<JsonResponse> {
    const prompt = `    
    Given the following world description:
    "${world.summary}"
    Generate a 3 paragraph description of a location in ${world.name}.
    Describe it's history within the world.

    Give it a name.
    
    And must have the following features:
    It is in a ${getRandomValue(biomes)} biome.    
    It's population size is ${getRandomValue(populationSizes)}
    It's safety level is ${getRandomValue(safetyLevels)}
    It's wealth level is ${getRandomValue(wealthLevels)}
    
    Respond only in JSON with the following format:
    
    {
        "name": "the name of the location",
        "summary": "the generated description",
    }
    `;


    return JSON.parse(await executePrompt(prompt)) as JsonResponse;
}