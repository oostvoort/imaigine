import * as dotenv from 'dotenv';
import cors from 'cors';
import express, {Request, Response} from 'express';
import {
    CharacterStats,
    CharacterStory,
    GeneratePlayerCharacterProps,
    GenerateLocationProps,
    GenerateStoryProps,
    GenerateNonPlayerCharacterProps
} from 'types'
import {generateStory} from "./lib/openai/generate/generateStory";
import {generateLocation} from "./lib/openai/generate/generateLocation";
import {generateNonPlayerCharacter, generatePlayerCharacter} from "./lib/openai/generate/generateCharacter";
import {generatePlayerImage} from "./lib/leonardo";

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
    res.send('OK 👌');
});

app.post('/generateStory', async (req: Request, res: Response) => {
    const props: GenerateStoryProps = req.body
    res.send(await generateStory(props));
});

app.post('/generateLocation', async (req: Request, res: Response) => {
    const props: GenerateLocationProps = req.body
    res.send(await generateLocation(props));
});

app.post('/generatePlayerCharacter', async (req: Request, res: Response) => {
    const props: GeneratePlayerCharacterProps = req.body

    const player = await generatePlayerCharacter(props);

    // player.imageHash = await generatePlayerImage(player.visualSummary)

    res.send(player);
});

app.post('/generateNonPlayerCharacter', async (req: Request, res: Response) => {
    const props: GenerateNonPlayerCharacterProps = req.body
    res.send(await generateNonPlayerCharacter(props));
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
