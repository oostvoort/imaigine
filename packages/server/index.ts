import * as dotenv from 'dotenv'
import cors from 'cors'
import express, { Request, Response } from 'express'
import {
  BaseConfig, Based,
  GenerateLocationProps,
  GenerateLocationResponse,
  GenerateNpcProps,
  GenerateNpcResponse,
  GeneratePlayerProps,
  GeneratePlayerResponse,
  GenerateStoryProps,
  StoreToIPFS, StoryConfig,
} from 'types'
import { getLocation } from './utils/getLocation'
import { generateLocation, generateNonPlayerCharacter, generatePlayerCharacter, generateStory } from './lib/langchain'
import { generateLocationImage, generatePlayerImage } from './lib/leonardo'
import { PLAYER_IMAGE_CHOICES, STORY } from './global/constants'
import { getRandomLocation } from './utils/getRandomLocation'
import { storeJson } from './lib/ipfs'
import sqlite3 from "sqlite3";

const database = new sqlite3.Database(`${process.env.DB_SOURCE}`, err => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    database.run(`CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, counterpart TEXT, players TEXT, log TEXT)`,
        (err) => {
          if (err) {
            console.error('Error creating table:', err)
          } else {
            console.log('Database is ready.')
          }
        })
  }
})
import { getBaseConfigFromIpfs } from './utils/getBaseConfigFromIpfs'
import { getFromIpfs } from './utils/getFromIpfs'

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

let baseConfig: BaseConfig = {} as BaseConfig
let storyConfig: StoryConfig = {} as StoryConfig

app.listen(port,async () => {
  baseConfig = await getBaseConfigFromIpfs()
  storyConfig = await getFromIpfs(baseConfig.storyConfig)

  console.log(`Example app listening on port ${port}`)
})

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
  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/generate-location', async (req: Request, res: Response, next) => {
  const props: GenerateLocationProps = req.body

  try {
    const locationName = await getLocation(props.id)

    const location = await generateLocation(STORY, locationName)

    const imageHash = await generateLocationImage(location.visualSummary)

    res.send({
      name: location.name,
      description: location.description,
      imageHash: imageHash,
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
      storyName: STORY.name,
      storyDescription: STORY.description,
      locationName: locationName,
      locationDescription: props.description,
    })

    const imageHash = await generatePlayerImage(npc.visualSummary)

    res.send({
      name: npc.name,
      description: npc.description,
      imageHash: imageHash,
      initialMessage: npc.initialMessage,
    } as GenerateNpcResponse)
  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/generate-player', async (req: Request, res: Response, next) => {
  const props: GeneratePlayerProps = req.body

  const imageHashes: string[] = []

  try {

    const startingLocation = getRandomLocation(baseConfig.startingLocations)

    const startingLocationDetails: Based = await getFromIpfs(startingLocation.config)

    const player = await generatePlayerCharacter({
      storyName: storyConfig.name,
      storyDescription: storyConfig.summary,
      locationName: startingLocationDetails.name,
      locationDescription: startingLocationDetails.summary,
      ageGroup: props.ageGroup,
      bodyType: props.bodyType,
      race: props.race,
      favColor: props.favColor,
      genderIdentity: props.genderIdentity,
      skinColor: props.skinColor,
    })

    const playerIpfsHash = await storeJson({
      name: player.name,
      description: player.description
    })

    for (let i = 1; i <= PLAYER_IMAGE_CHOICES; i++) {
      const image = await generatePlayerImage(player.visualSummary)
      imageHashes.push(image)
    }

    res.send({
      ipfsHash: playerIpfsHash,
      imgHashes: imageHashes,
      locationId: startingLocation.id
    } as GeneratePlayerResponse)

  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/pin-to-ipfs', async (req: Request, res: Response, next) => {
  const props: StoreToIPFS = req.body

  try {
    const hash = await storeJson(props.json)
    res.send({
      ipfsHash: hash,
    })
  } catch (e) {
    next(e)
  }
})

// mock api

app.post('/mock/api/v1/generate-story', async (req: Request, res: Response, next) => {
  res.send({
    name: 'Fantasy World',
    description: 'This magical fantasy world is populated with elf, goblin, human, nymph, dwarf, troll and many other fantastical creatures. It features rolling hills, towering mountaintops, sparkling waterfalls and mysterious forests. Magical creatures soar through the skies and cast potent spells with ease. The inhabitants live in small towns and villages, or in large imposing castles.',
  })
})

app.post('/mock/api/v1/generate-location', async (req: Request, res: Response, next) => {
  res.send({
    name: 'Eldoria',
    description: 'Eldoria is a hidden elven city nestled deep within an ancient forest. The city is built on treetops, connected by rope bridges and shimmering magic. The air is filled with the sweet scent of blooming flowers, and the ethereal glow of luminescent creatures dances among the leaves. The elven inhabitants are known for their graceful nature and affinity for magic.',
    imageHash: 'abc123',
  })
})

app.post('/mock/api/v1/generate-player', async (req: Request, res: Response, next) => {
  res.send({
      ipfsHash: 'QmT23hETEuddnXWoCn4veVtFKkaWLbbyKFfqbi5DwbJZr9',
      imgHashes: [
        'QmSSLuNfitVEDoda5x5DvzgydT6J8mwLjXMFrw5fq5rfJb',
        'QmYseeJuSTUedYcsKdn4BPhqsUUebxB2V3DZGQttZ3rnm7',
        'QmTjuQDVSPTyDrLC4Ri3pLvqn7HYibW6bA7WYoSKE73MAM',
      ],
      locationId: '0x0000000000000000000000000000000000000000000000000000000000000002',
    } as GeneratePlayerResponse,
  )
})

app.post('/mock/api/v1/generate-npc', async (req: Request, res: Response, next) => {
  res.send({
    name: 'Eldrick Stoneforge',
    description: 'Eldrick Stoneforge is a grizzled dwarf blacksmith hailing from the mountain stronghold of Hammerfall. With a weathered face adorned with a thick, braided beard and piercing blue eyes, Eldrick is a master of his craft. He can be found in his smoky forge, hammering and shaping metal with expert precision. His muscular frame and stout stature reflect years of hard labor and battles fought. Eldrick is known for his unparalleled ability to forge legendary weapons and armor, which have become sought-after treasures among adventurers and warriors across the realm.',
    imageHash: 'mno345',
    initialMessage: 'Hi I\'m Eldrick Stoneforge',
  })
})

app.post('/mock/api/v1/generate-travel', async (req: Request, res: Response, next) => {

  res.send({
    situation: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias animi asperiores consequuntur corporis illo iusto nihil sunt vero? Corporis earum eligendi excepturi explicabo laboriosam minima nostrum optio quam recusandae sed. ',
    playerHistory: 'mno345',
  })
})

// Write data to the history table
app.post('/write-history', (req, res) => {
  const counterpart = req.body.counterpart;
  const players = req.body.players;
  const log = req.body.log;

  const insertQuery = 'INSERT INTO history (counterpart, players, log) VALUES (?, ?, ?)';

  database.run(insertQuery, [counterpart, players, log], function (err) {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    } else {
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
    }
  });
});

// Read data from the history table
app.get('/read-history', (req, res) => {
  const selectQuery = 'SELECT * FROM history';

  database.all(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).send('Error reading data');
    } else {
      console.log('Data retrieved successfully');
      res.status(200).json(rows);
    }
  });
});
