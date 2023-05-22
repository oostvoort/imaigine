import * as dotenv from 'dotenv'
import cors from 'cors'
import express, { Request, Response } from 'express'
import {
  GenerateInteractionProps,
  GenerateInteractionResponse,
  GenerateItemProps,
  GenerateItemResponse,
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
import { generateItemImage, generatePlayerImage } from './lib/leonardo'
import { generatePath } from './lib/openai/generate/generatePath'
import { generateTravel } from './lib/openai/generate/generateTravel'
import { generateInteraction } from './lib/openai/generate/generateInteraction'
import { generateLocationImage } from './lib/leonardo/executePrompt'
import { generateItem } from './lib/openai/generate/generateItem'

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.get('/', (req: Request, res: Response) => {
  res.send('OK 👌')
})

app.post('/generateStory', async (req: Request, res: Response, next) => {
  const props: GenerateStoryProps = req.body
  try {
    const story = await generateStory(props)
    res.send(story)
  } catch (e) {
    next(e)
  }
})

app.post('/generateLocation', async (req: Request, res: Response, next) => {
  const props: GenerateLocationProps = req.body
  try {
    const response = await generateLocation(props)
    response.imageHash = await generateLocationImage(response.visualSummary)
    res.send(response)
  } catch (e) {
    next(e)
  }
})

app.post('/generateItem', async (req: Request, res: Response) => {
  const props: GenerateItemProps = req.body
  const response: GenerateItemResponse = await generateItem(props)
  response.imageHash = await generateItemImage(response.visualSummary)

  res.send(response)
})

app.post('/generatePlayerCharacter', async (req: Request, res: Response, next) => {
  const props: GeneratePlayerCharacterProps = req.body
  try {
    const player = await generatePlayerCharacter(props)
    player.imageHash = await generatePlayerImage(player.visualSummary)
    res.send(player)
  } catch (e) {
    next(e)
  }
})

app.post('/generateNonPlayerCharacter', async (req: Request, res: Response, next) => {
  const props: GenerateNonPlayerCharacterProps = req.body

  try {
    const player = await generateNonPlayerCharacter(props)
    player.imageHash = await generatePlayerImage(player.visualSummary)
    res.send(player)
  } catch (e) {
    next(e)
  }
})

app.post('/generatePath', async (req: Request, res: Response, next) => {
  const props: GeneratePathProps = req.body
  try {
    res.send(await generatePath(props))
  } catch (e) {
    next(e)
  }
})


app.post('/generateInteraction', async (req: Request, res: Response, next) => {
  const props: GenerateInteractionProps = req.body
  try {
    const response: GenerateInteractionResponse = await generateInteraction(props)
    res.send(response)
  } catch (e) {
    next(e)
  }
})


app.post('/generateTravel', async (req: Request, res: Response, next) => {
  const props: GenerateTravelProps = req.body
  try {
    const response: GenerateTravelResponse = await generateTravel(props)
    res.send(response)
  } catch (e) {
    next(e)
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
