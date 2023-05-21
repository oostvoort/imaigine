import * as dotenv from 'dotenv';
import cors from 'cors';
import express, {Request, Response} from 'express';
import {CharacterStats, CharacterStory, GeneratePlayerCharacterProps, GenerateLocationProps, GenerateWorldProps} from 'types'
import {generateWorld} from "./lib/openai/generate/generateWorld";
import {generateLocation} from "./lib/openai/generate/generateLocation";
import {generatePlayerCharacter} from "./lib/openai/generate/generatePlayerCharacter";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    cors({
        origin: '*',
    })
);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.post('/generateWorld', async (req: Request, res: Response) => {
    const props: GenerateWorldProps = req.body
    res.send(await generateWorld(props));
});

app.post('/generateLocation', async (req: Request, res: Response) => {
    const props: GenerateLocationProps = req.body
    res.send(await generateLocation(props));
});

app.post('/generateCharacter', async (req: Request, res: Response) => {
    const props: GeneratePlayerCharacterProps = req.body
    res.send(await generatePlayerCharacter(props));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
