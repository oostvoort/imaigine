import * as dotenv from 'dotenv';
import {OpenAIApi} from 'openai/dist/api';
import {Configuration} from 'openai/dist/configuration';
import {CharacterStats, CharacterStory} from 'types'

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || '',
});
const openai = new OpenAIApi(configuration);
console.log(process.env.OPENAI_API_KEY);

export async function generateGenesis({story, stats}: {
    story: CharacterStory,
    stats: CharacterStats
}): Promise<string> {

    const prompt = `
    Create an epic story introduction in the ${story.universe} universe.
    It features a character named ${story.name}.
    ${story.name} is a ${story.age}.
     
    ${story.name} possesses the following stats:
    Strength: ${stats.strength} 
    Dexterity: ${stats.dexterity} 
    Constitution: ${stats.constitution} 
    Intelligence: ${stats.intelligence} 
    Charisma: ${stats.charisma} 
    Wisdom: ${stats.wisdom}
     
    Their stats must affect their story in some meaningful way.
    
    ${story.name} has a ${story.pet} pet.
    ${story.name} has a passion for ${story.activity}. 
    ${story.name} must have a main quest they must accomplish
    Include a vivid description of the mode of transportation used and name their pet if applicable.
    `;


    return await executePrompt(prompt);
}

async function executePrompt(prompt: string): Promise<string> {
    console.log(`Prompt: ${prompt}`);
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const story = response.data.choices[0].text;

    const json = await getJson(story);

    console.log(story);
    console.log(json);
    return story;
}

async function getJson(story: string): Promise<string> {
    const prompt = `For the following story, generate a json structure that includes characters, locations, adventures and vehicles: ${story}`;

    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.0,
        max_tokens: 1000,
        top_p: 0.0001,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const json = response.data.choices[0].text;

    return json;
}
