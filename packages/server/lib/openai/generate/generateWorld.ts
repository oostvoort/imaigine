import {executePrompt} from "../executePrompt";
import {Location} from "./generateLocation";

export interface World {
    theme: string,
    races: Array<string>,
    currency: string,
    description: string,
    name: string,
    locations: Array<Location>
}

export interface GenerateWorldProps {
    theme: string,
    races: Array<string>,
    currency: string,
}

export async function generateWorld({currency, races, theme}: GenerateWorldProps): Promise<string> {


    const prompt = `    
    Generate a description of a ${theme} world. 
    Give it a name.
    The world is populated by ${races.join(" and ")}
    The distinctive currency known as ${currency} is in circulation.
    `;


    return await executePrompt(prompt);
}