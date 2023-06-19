import * as dotenv from 'dotenv'
import cors from 'cors'
import express, { Request, Response } from 'express'
import {
  ExtractElementsResponse,
  GenerateDescriptiveLocationProps,
  GenerateDescriptiveLocationResponse,
  GenerateHumanPlayerCharacterResponse,
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
import { extractElements, generateDescriptiveLocation, generateLocation } from './lib/openai/generate/generateLocation'
import { generateNonPlayerCharacter, generatePlayerCharacter } from './lib/openai/generate/generateCharacter'
import { generateItemImage, generatePlayerImage } from './lib/leonardo'
import { generatePath } from './lib/openai/generate/generatePath'
import { generateTravel } from './lib/openai/generate/generateTravel'
import { generateInteraction } from './lib/openai/generate/generateInteraction'
import { generateLocationImage } from './lib/leonardo/executePrompt'
import { generateItem } from './lib/openai/generate/generateItem'
import { PLAYER_IMAGE_CHOICES } from './global/constants'

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

app.post('/generateStory', async (req: Request, res: Response, next) => {
  const props: GenerateStoryProps = req.body
  try {
    const story = await generateStory(props)
    res.send(story)
  } catch (e) {
    next(e)
  }
})

app.post('/generateDescriptiveLocation', async (req: Request, res: Response, next) => {
  const props: GenerateDescriptiveLocationProps = req.body
  try {
    const mainLocation = await generateDescriptiveLocation(props)

    // if image for this was already generated, use that
    if (props.imageHash) {
      mainLocation.imageHash = props.imageHash
    } else {
      mainLocation.imageHash = await generateLocationImage(mainLocation.visualSummary)
    }

    let elements: ExtractElementsResponse = {
      locations: [],
      characters: [],
      items: []
    }

    // sometimes chatgpt doesn't extract all the locations so, we're making it redo it until it extracts at least 2
    do {
      elements = await extractElements(mainLocation)
    } while (elements.locations.length < 2)

    // switch out the extracted location info of the main location
    const indexOfMainLocation = elements.locations.findIndex(location => location.name === mainLocation.name)
    if (indexOfMainLocation > -1) elements.locations[indexOfMainLocation] = mainLocation


    if (props.generateElementImages) {
      for (let i = 0; i < elements.locations.length; i++) {
        // do not generate image for the mainLocation
        if (elements.locations[i].name === mainLocation.name) continue
        elements.locations[i].imageHash = await generateLocationImage(elements.locations[i].visualSummary)
      }
      for (let i = 0; i < elements.items.length; i++) {
        elements.items[i].imageHash = await generateItemImage(elements.items[i].visualSummary)
      }
      for (let i = 0; i < elements.characters.length; i++) {
        elements.characters[i].imageHash = await generatePlayerImage(elements.characters[i].visualSummary)
      }
    }

    const response: GenerateDescriptiveLocationResponse = { mainLocation, elements}
    res.send(response)

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
    const player: GenerateHumanPlayerCharacterResponse = { ...await generatePlayerCharacter(props), choices: [] }
    const generatePlayerImagePromises: Promise<string>[] = []
    for (let i = 0; i < PLAYER_IMAGE_CHOICES; i ++) {
      generatePlayerImagePromises.push(generatePlayerImage(player.visualSummary))
    }
    player.choices = await Promise.all(generatePlayerImagePromises)
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
    imageHash: [
      "QmSSLuNfitVEDoda5x5DvzgydT6J8mwLjXMFrw5fq5rfJb",
      "QmYseeJuSTUedYcsKdn4BPhqsUUebxB2V3DZGQttZ3rnm7",
      "QmTjuQDVSPTyDrLC4Ri3pLvqn7HYibW6bA7WYoSKE73MAM"
    ]
  })
})

app.post('/mock/api/v1/generate-npc', async (req: Request, res: Response, next) => {
  res.send({
    name: "Eldrick Stoneforge",
    description: "Eldrick Stoneforge is a grizzled dwarf blacksmith hailing from the mountain stronghold of Hammerfall. With a weathered face adorned with a thick, braided beard and piercing blue eyes, Eldrick is a master of his craft. He can be found in his smoky forge, hammering and shaping metal with expert precision. His muscular frame and stout stature reflect years of hard labor and battles fought. Eldrick is known for his unparalleled ability to forge legendary weapons and armor, which have become sought-after treasures among adventurers and warriors across the realm.",
    imageHash: "mno345"
  })
})

app.post('/mock/api/v1/generate-travel', async (req: Request, res: Response, next) => {

  res.send({
    situation: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias animi asperiores consequuntur corporis illo iusto nihil sunt vero? Corporis earum eligendi excepturi explicabo laboriosam minima nostrum optio quam recusandae sed. ",
    playerHistory: "mno345"
  })
})

app.post('/mock/api/v1/generate-npc-interaction', async (req: Request, res: Response, next) => {

  res.send({
    conversationHistory: [
      {
        blockTimestamp: 1,
        mode: 'dialog',
        text: 'Hi! How are you?',
        speaker: 'NPC',
        players: ['player-1']
      },
      {
        blockTimestamp: 2,
        mode: 'dialog',
        text: 'Good?',
        speaker: 'Player',
        players: ['player-1']
      }
    ],
    playerHistory: "sample123",
    entityHistory: "sample456",
    possibles: [
      {
        karmaPoints: 10,
        mode: 'action',
        text: "action 1"
      },
      {
        karmaPoints: 5,
        mode: 'action',
        text: "action 2"
      },
      {
        karmaPoints: 5,
        mode: 'action',
        text: "action 3"
      }
    ]
  })
})

app.post('/mock/api/v1/generate-location-interaction', async (req: Request, res: Response, next) => {

  res.send({
    situation: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias animi asperiores consequuntur corporis illo iusto nihil sunt vero? Corporis earum eligendi excepturi explicabo laboriosam minima nostrum optio quam recusandae sed. ",
    playerHistory: "sample123",
    entityHistory: "sample456",
    possibles: [
      {
        karmaPoints: 10,
        mode: 'action',
        text: "action 1"
      },
      {
        karmaPoints: 5,
        mode: 'action',
        text: "action 2"
      },
      {
        karmaPoints: 5,
        mode: 'action',
        text: "action 3"
      }
    ]
  })
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
