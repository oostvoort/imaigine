import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv'
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
console.log(process.env.OPENAI_API_KEY)

export async function generateGenesis({name, pet, age, food, universe, activity, alignment}){
    const prompt = `give me the beginning of an epic story about an ${alignment} character named ${name} who is age ${age}, may have a pet ${pet}, whose favorite food is ${food}, likes to do ${activity}. place the story in the '${universe}' storytelling universe. Include a location that is travelled to, and name the pet if there is one. Include and describe mode of transportation`

    return await executePrompt(prompt)
}

async function executePrompt(prompt){
    console.log(`Prompt: ${prompt}`)
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const story =response.data.choices[0].text

    const json = await getJson(story)

    console.log(story)
    console.log(json)
    return story
}

async function getJson(story){
    const prompt = `For the following story, generate a json structure that includes characters, locations, adventures and vehicles: ${story}`

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.0,
        max_tokens: 1000,
        top_p: 0.0001,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const json =response.data.choices[0].text

    return json

}