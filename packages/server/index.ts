import * as dotenv from 'dotenv';
import cors from 'cors';
import express, {Request, Response} from 'express';
import {CharacterStats, CharacterStory} from 'types'
import {setup} from "./lib/mud/setup";

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

// POST method route
app.post('/generateStory', async (req: Request, res: Response) => {
    const {story, stats}: { story: CharacterStory, stats: CharacterStats } = req.body
    // res.send(await generateGenesis({story, stats}));
});

app.listen(port, async () => {
    await setup()
    console.log(`Example app listening on port ${port}`);
});
