import {executePrompt} from "../executePrompt";
import {CharacterStats, CharacterStory} from 'types'
import {Location} from "./generateLocation";


export interface Character {
    name: string,
    description: string,
    story: CharacterStory,
    stats: CharacterStats,
    items: Array<string>
}

export interface GenerateCharacterProps {
    name: string
    stats: CharacterStats,
    story: CharacterStory,
    location: Location
}


export async function generateCharacter({name, stats, story, location}: GenerateCharacterProps): Promise<string> {
    const prompt = `
    Generate a character description for a character named "${name}".
    ${name} is a ${story.age}.
     
    ${name} possesses the following stats:
    Strength: ${stats.strength} 
    Dexterity: ${stats.dexterity} 
    Constitution: ${stats.constitution} 
    Intelligence: ${stats.intelligence} 
    Charisma: ${stats.charisma} 
    Wisdom: ${stats.wisdom}
     
    Their stats must affect their description in some meaningful way.
    
    ${name} has a ${story.pet} pet.
    ${name} has a passion for ${story.activity}. 
    ${name} must have a personal goal
    
    They start in a location named "${location.name}" with the description "${location.description}"
    Don't include the location description in the character description.
    Describe how the character is related to the location, like how they lived or came to that place.
    `;


    return await executePrompt(prompt);
}