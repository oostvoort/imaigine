import * as dotenv from 'dotenv'
dotenv.config()

import cors from "cors"
import express from "express"
const app = express()
const port = 3000
import {generateGenesis} from "./openai.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// POST method route
app.post('/genesis',async (req, res) => {
    console.log(req.body)
    const response = await generateGenesis(req.body)
    res.send(response)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
