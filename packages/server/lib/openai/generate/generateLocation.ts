import {executePrompt} from "../executePrompt";
import {AIWorld} from "./generateWorld";
import {AICharacter} from "./generateCharacter";


export interface AILocation {
    name: string,
    description: string,
    characters: Array<AICharacter>,
    items: Array<string>
}

export interface GenerateLocationProps {
    world: AIWorld,
    biome: string,
}


export async function generateLocation({biome, world}: GenerateLocationProps): Promise<string> {
    const prompt = `    
    Given the following world description:
    
    "${world.description}"
    
    Give a detailed description of a location in ${world.name}.
    It is in a ${biome} biome.
    Give it a name.
    Describe it's history within the world.
    `;


    return await executePrompt(prompt);
}