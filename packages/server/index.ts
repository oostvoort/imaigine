import * as dotenv from 'dotenv'
import cors from 'cors'
import express, { Request, Response } from 'express'
import {
  GenerateInteractProps,
  GenerateInteractResponse,
  GenerateLocationProps,
  GenerateNonPlayerCharacterProps,
  GeneratePathProps,
  GeneratePlayerCharacterProps,
  GenerateStoryProps,
  GenerateTravelProps,
  GenerateTravelResponse,
} from 'types'
import { generateStory } from './lib/openai/generate/generateStory'
import { generateLocation } from './lib/openai/generate/generateLocation'
import { generateNonPlayerCharacter, generatePlayerCharacter } from './lib/openai/generate/generateCharacter'
import { generatePlayerImage } from './lib/leonardo'
import { generatePath } from './lib/openai/generate/generatePath'
import { generateTravel } from './lib/openai/generate/generateTravel'

dotenv.config()
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: '*',
  }),
)

app.get('/', (req: Request, res: Response) => {
  res.send('OK 👌')
})

app.post('/generateStory', async (req: Request, res: Response) => {
  const props: GenerateStoryProps = req.body
  const story = await generateStory(props)
  res.send(story)
})

app.post('/generateLocation', async (req: Request, res: Response) => {
  const props: GenerateLocationProps = req.body
  res.send(await generateLocation(props))
})

app.post('/generatePlayerCharacter', async (req: Request, res: Response) => {
  const props: GeneratePlayerCharacterProps = req.body

  const player = await generatePlayerCharacter(props)

  player.imageHash = await generatePlayerImage(player.visualSummary)

  res.send(player)
})

app.post('/generateNonPlayerCharacter', async (req: Request, res: Response) => {
  const props: GenerateNonPlayerCharacterProps = req.body
  res.send(await generateNonPlayerCharacter(props))
})

app.post('/generatePath', async (req: Request, res: Response) => {
  const props: GeneratePathProps = req.body
  res.send(await generatePath(props))
})

// TODO: implement
app.post('/generateInteract', async (req: Request, res: Response) => {
  const props: GenerateInteractProps = req.body
  const response: GenerateInteractResponse = { todo: true }
  res.send(response)
})


app.post('/generateTravel', async (req: Request, res: Response) => {
  const props: GenerateTravelProps = req.body
  const response: GenerateTravelResponse = await generateTravel(props)
  res.send(response)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
