import openai from "./openai";

export async function executePrompt(prompt: string): Promise<string> {
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
    return response.data.choices[0].text.replace("\n", "").trimStart();
}

