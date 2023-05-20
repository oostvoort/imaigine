import * as dotenv from 'dotenv';
import {OpenAIApi} from 'openai/dist/api';
import {Configuration} from 'openai/dist/configuration';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || '',
});

const openai = new OpenAIApi(configuration);
export default openai

