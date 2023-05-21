import {executePrompt} from "../executePrompt";
import {GeneratePathProps, JsonResponse} from "types";

export interface AIPath {
    toLocation?: string,
    fromLocation?: string,
    name: string,
    summary: string
}


export async function generatePath({toLocation, fromLocation}: GeneratePathProps): Promise<JsonResponse> {
    const prompt = `    
    Generate a vivid description of a path that will connect two locations
    Explain how the path is logical and makes sense
    Give details on how the transition from moving from the first location to the second
    Give the path a very unique name
    The description should be like travel brochure
    
    Name of the first location: "${fromLocation.name}"
    Description of the first location: "${fromLocation.summary}"
    
    Name of the second location: "${toLocation.name}"
    Description of the second location: "${toLocation.summary}"
    
    Respond only in JSON with the following format:
    
    {
        "name": "the name of the location",
        "summary": "the generated description",
    }
    `;


    return JSON.parse(await executePrompt(prompt)) as JsonResponse;
}