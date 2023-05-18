import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Request, Response } from 'express';
import { generateGenesis } from './openai';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: '*',
    })
);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// POST method route
app.post('/genesis', async (req: Request, res: Response) => {
    console.log(req.body);
    const response = await generateGenesis(req.body);
    res.send(response);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
