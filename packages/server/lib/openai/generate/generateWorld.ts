import {executePrompt} from "../executePrompt";
import {AILocation} from "./generateLocation";
import {JsonResponse} from "../types";
import { GenerateWorldProps } from "types";

export interface AIWorld {
    theme: string,
    races: Array<string>,
    summary: string,
    name: string,
    locations: Array<AILocation>,
}

export async function generateWorld({currency, races, theme, extraDescriptions}: GenerateWorldProps): Promise<JsonResponse> {
    const prompt = `
    Generate a 3 paragraph description of a ${theme} world. 
    The world is populated by ${races.join(" and ")}
    The distinctive currency known as ${currency} is in circulation.
    
    Add these extra descriptions, flesh them out and integrate into the description:
    ${extraDescriptions.join(', ')}
    
    Respond only in JSON with the following format:

    {
        "name": "the name of the world",
        "summary": "the generated description"
    }
    `;

    const text = await executePrompt(prompt);
    return JSON.parse(text) as JsonResponse;
}