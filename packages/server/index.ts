import * as dotenv from 'dotenv'
import cors from 'cors'
import express, { Request, Response } from 'express'
import {
  GenerateLocationProps,
  GenerateLocationResponse,
  GenerateNpcProps, GenerateNpcResponse,
  GeneratePlayerProps, GeneratePlayerResponse,
  GenerateStoryProps
} from 'types'
import {getLocation} from "./utils/getLocation";
import {generateLocation, generateNonPlayerCharacter, generatePlayerCharacter, generateStory} from "./lib/langchain";
import {generateLocationImage, generatePlayerImage} from "./lib/leonardo";
import {PLAYER_IMAGE_CHOICES} from "./global/constants";
import {getRandomLocation} from "./utils/getRandomLocation";

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

app.use('/', express.static('public'))

app.post('/api/v1/generate-story', async (req: Request, res: Response, next) => {
  const props: GenerateStoryProps = req.body

  try {
    const story = await generateStory(props)
    res.send(story)
  }catch (e) {
    next(e)
  }
})

app.post('/api/v1/generate-location', async (req: Request, res: Response, next) => {
  const props: GenerateLocationProps = req.body

  try {
    const locationName = await getLocation(props.id)

    const location = await generateLocation(props.story, locationName)

    const imageHash= await generateLocationImage(location.visualSummary)

    res.send({
      name: location.name,
      description: location.description,
      imageHash: imageHash
    } as GenerateLocationResponse)

  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/generate-npc', async (req: Request, res: Response, next) => {
  const props: GenerateNpcProps = req.body

  try {
    const locationName = await getLocation(props.id)

    const npc = await generateNonPlayerCharacter({
      storyName: props.story.name,
      storyDescription: props.story.description,
      locationName: locationName,
      locationDescription: props.description
    })

    console.info({npc})

    const imageHash = await generatePlayerImage(npc.visualSummary)

    res.send({
      name: npc.name,
      description: npc.description,
      imageHash: imageHash,
      initialMessage: npc.initialMessage
    } as GenerateNpcResponse)
  }catch (e) {
    next(e)
  }
})

app.post('/api/v1/generate-player', async (req: Request, res: Response, next) => {
  const props: GeneratePlayerProps = req.body

  const imageHashes: string[] = []

  try {

    const location = getRandomLocation()

    const player = await generatePlayerCharacter({
      storyName: props.story.name,
      storyDescription: props.story.description,
      locationName: location.name,
      locationDescription: location.summary,
      ageGroup: props.ageGroup,
      bodyType: props.bodyType,
      race: props.race,
      favColor: props.favColor,
      genderIdentity: props.genderIdentity,
      skinColor: props.skinColor
    })

    for (let i = 1; i <= PLAYER_IMAGE_CHOICES; i++) {
      const image = await generatePlayerImage(player.visualSummary)
      imageHashes.push(image)
    }

    res.send({
      name: player.name,
      description: player.description,
      imageHashes: imageHashes,
      locationId: location.id
    } as GeneratePlayerResponse)

  }catch (e) {
    next(e)
  }
})

// mock api

app.post('/mock/api/v1/generate-story', async (req: Request, res: Response, next) => {
  res.send({
    name: "Fantasy World",
    description: "This magical fantasy world is populated with elf, goblin, human, nymph, dwarf, troll and many other fantastical creatures. It features rolling hills, towering mountaintops, sparkling waterfalls and mysterious forests. Magical creatures soar through the skies and cast potent spells with ease. The inhabitants live in small towns and villages, or in large imposing castles."
  })
})

app.post('/mock/api/v1/generate-location', async (req: Request, res: Response, next) => {
  res.send({
    name: "Eldoria",
    description: "Eldoria is a hidden elven city nestled deep within an ancient forest. The city is built on treetops, connected by rope bridges and shimmering magic. The air is filled with the sweet scent of blooming flowers, and the ethereal glow of luminescent creatures dances among the leaves. The elven inhabitants are known for their graceful nature and affinity for magic.",
    imageHash: "abc123"
  })
})

app.post('/mock/api/v1/generate-player', async (req: Request, res: Response, next) => {
  res.send({
    name: "Ariana Shadowheart",
    description: "Ariana Shadowheart is a skilled elven ranger with a mysterious past. Her emerald eyes gleam with wisdom and determination, and her long silver hair flows gracefully as she moves through the enchanted forests. Clad in lightweight, forest-green attire, she is armed with a finely crafted bow and a quiver of arrows. Ariana possesses a deep connection with nature, often communicating with woodland creatures and harnessing the power of the forest in her spells. She is known for her unparalleled archery skills and her unwavering loyalty to her companions.",
    imageHashes: [
      "QmSSLuNfitVEDoda5x5DvzgydT6J8mwLjXMFrw5fq5rfJb",
      "QmYseeJuSTUedYcsKdn4BPhqsUUebxB2V3DZGQttZ3rnm7",
      "QmTjuQDVSPTyDrLC4Ri3pLvqn7HYibW6bA7WYoSKE73MAM"
    ],
    locationId: "0x00000000000000000000000023"
  })
})

app.post('/mock/api/v1/generate-npc', async (req: Request, res: Response, next) => {
  res.send({
    name: "Eldrick Stoneforge",
    description: "Eldrick Stoneforge is a grizzled dwarf blacksmith hailing from the mountain stronghold of Hammerfall. With a weathered face adorned with a thick, braided beard and piercing blue eyes, Eldrick is a master of his craft. He can be found in his smoky forge, hammering and shaping metal with expert precision. His muscular frame and stout stature reflect years of hard labor and battles fought. Eldrick is known for his unparalleled ability to forge legendary weapons and armor, which have become sought-after treasures among adventurers and warriors across the realm.",
    imageHash: "mno345",
    initialMessage: "Hi I'm Eldrick Stoneforge"
  })
})

app.post('/mock/api/v1/generate-travel', async (req: Request, res: Response, next) => {

  res.send({
    situation: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias animi asperiores consequuntur corporis illo iusto nihil sunt vero? Corporis earum eligendi excepturi explicabo laboriosam minima nostrum optio quam recusandae sed. ",
    playerHistory: "mno345"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
