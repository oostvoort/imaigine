import {executePrompt} from "../executePrompt";
import {CharacterPhysicalFeatures, CharacterStats, CharacterStory, GenerateCharacterProps} from 'types'
import {JsonResponse} from "../types";

export interface AICharacter {
    name: string,
    description: string,
    story: CharacterStory,
    stats: CharacterStats,
    physicalFeatures: CharacterPhysicalFeatures,
    items: Array<string>
}

export async function generateCharacter({location, physicalFeatures, stats, story, world}: GenerateCharacterProps): Promise<JsonResponse> {
    const prompt = `
    Generate a character description based on the following:
    
    The character lives in ${world.name} with the description "${world.description}" 
    Don't include the world description in the character description.
    
    They start in a location named "${location.name}" with the description "${location.description}"
    Don't include the location description in the character description.
    
    Describe how the character is related to the location, like how they lived or came to that place.
    
    The character possesses the following stats:
    Strength: ${stats.strength} 
    Dexterity: ${stats.dexterity} 
    Constitution: ${stats.constitution} 
    Intelligence: ${stats.intelligence} 
    Charisma: ${stats.charisma} 
    Wisdom: ${stats.wisdom}
    Their stats must affect their description in some meaningful way.
    
    The character is a ${physicalFeatures.race}
    The character has a ${physicalFeatures.body} body
    The character has ${physicalFeatures.hair} hair
    The character is ${physicalFeatures.height} in height
    The character has ${physicalFeatures.eyes} eyes
    The character is a ${physicalFeatures.ageGroup}
    
    The character has a ${story.pet} pet.
    The character has a passion for ${story.activity}. 
    
    
    Output as a JSON object in this format:
    {
        "name": "the name of the character",
        "description": "the generated description"
    }
    `;

    return JSON.parse(await executePrompt(prompt)) as JsonResponse;
}