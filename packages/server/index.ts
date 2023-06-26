import * as dotenv from 'dotenv'
import cors from 'cors'
import express, { Request, Response } from 'express'
import {
  BaseConfig,
  Based,
  GenerateLocationInteractionProps,
  GenerateLocationProps,
  GenerateLocationResponse,
  GenerateNpcProps,
  GenerateNpcResponse,
  GeneratePlayerProps,
  GeneratePlayerResponse,
  GenerateStoryProps,
  StoreToIPFS,
  StoryConfig,
} from 'types'
import {
  generateLocation,
  generateLocationInteraction,
  generateNonPlayerCharacter,
  generatePlayerCharacter,
  generateStory,
} from './lib/langchain'
import { generateLocationImage, generatePlayerImage } from './lib/leonardo'
import { getRandomLocation } from './utils/getRandomLocation'
import { storeJson } from './lib/ipfs'
import sqlite3 from 'sqlite3'
import { getBaseConfigFromIpfs } from './utils/getBaseConfigFromIpfs'
import { getFromIpfs } from './utils/getFromIpfs'
import { getLocationDetails, getLocationList } from './utils/getLocationList'
import * as path from 'path'
import { generateMap } from './generate'
import { PLAYER_IMAGE_CHOICES } from './global/constants'

dotenv.config()
import fs from "fs-extra"

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

const app = express()
const port = 3000


app.use('/map', express.static(path.join(process.cwd(), "../fantasy-map-generator")));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(
  cors({
    origin: '*',
  }),
)

let baseConfig: BaseConfig = {} as BaseConfig
let storyConfig: StoryConfig = {} as StoryConfig
let locations: Array<{ name: string, entityId: string }> = []

app.listen(port, async () => {
  baseConfig = await getBaseConfigFromIpfs()
  storyConfig = await getFromIpfs(baseConfig.storyConfig)
  locations = await getLocationList()

  console.log(`Example app listening on port ${port}: http://localhost:3000`)
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.get('/mapdata', async (req: Request, res: Response) => {

  try {
    const seed = parseInt(<string>req.query.seed)

    const filename = `${seed}.map`

    if(fs.existsSync(filename)){
      res.send(fs.readFileSync(filename))
    }else{
      const response = await generateMap(seed)
      res.send(response)
    }


  } catch (e) {
    res.sendStatus(500)
  }
})



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

    const locationDetails = await getLocationDetails(locations, props.id)

    if (locationDetails === undefined) throw new Error('Undefined Location!')

    const location = await generateLocation({
      name: storyConfig.name,
      description: storyConfig.summary,
    }, locationDetails.name)

    const locationIpfsHash = await storeJson({
      name: location.name,
      summary: location.description,
    })

    const imageHash = await generateLocationImage(location.visualSummary)

    res.send({
      ipfsHash: locationIpfsHash,
      imageHash: imageHash,
    } as GenerateLocationResponse)

  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/generate-npc', async (req: Request, res: Response, next) => {
  const props: GenerateNpcProps = req.body

  try {

    const location: Based = await getFromIpfs(props.locationIpfsHash)

    const npc = await generateNonPlayerCharacter({
      storyName: storyConfig.name,
      storyDescription: storyConfig.summary,
      locationName: location.name,
      locationDescription: location.summary,
    })

    const npcIpfsHash = await storeJson({
      name: npc.name,
      summary: npc.description,
    })

    // TODO: Initial message of NPC to db

    const imageHash = await generatePlayerImage(npc.visualSummary)

    res.send({
      ipfsHash: npcIpfsHash,
      imageHash: imageHash,
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
      description: player.description,
    })

    for (let i = 1; i <= PLAYER_IMAGE_CHOICES; i++) {
      const image = await generatePlayerImage(player.visualSummary)
      imageHashes.push(image)
    }

    res.send({
      ipfsHash: playerIpfsHash,
      imgHashes: imageHashes,
      locationId: startingLocation.id,
    } as GeneratePlayerResponse)

  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/generate-location-interaction', async (req: Request, res: Response, next) => {
  const props: GenerateLocationInteractionProps = req.body

  // TODO: get history from database
  const location: Based = await getFromIpfs(props.locationIpfsHash)
  const npc: Based = await getFromIpfs(props.npcIpfsHash[0])
  const player: { name: string, description: string } = await getFromIpfs(props.playerIpfsHash)

  const locationInteraction = await generateLocationInteraction({
    storyName: storyConfig.name,
    storySummary: storyConfig.summary,
    locationName: location.name,
    locationSummary: location.summary,
    npcName: npc.name,
    npcSummary: npc.summary,
    playerName: player.name,
    playerSummary: player.description,
    locationHistory: ``,
  })

  res.send(locationInteraction)
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
    ipfsHash: 'QmNt5Rgq9FiPMSepTCzCcp3iA16RzKYEJwsxa5YbigiJwF',
    imageHash: 'QmRUkLidYCU1SULZ9A7xMnydC11Um5syAScjFSUDmeEJoQ',
  } as GenerateLocationResponse)
})

app.post('/mock/api/v1/generate-location-interaction', async (req: Request, res: Response, next) => {
  res.send(
    {
      scenario: 'Ariana Shadowheart had arrived in the beautiful oasis of Eternal Springs, where the magical creatures and natural beauty was enough to take her breath away. She came to the city to find an old friend, Lirio, who had grown up in the city. Upon finding them, they excitedly recounted stories of their childhood adventures and the many perils of Eternal Springs. Ariana was enchanted by the stories and could feel the vibrant energy of its culture. She was offered three choices of how she might proceed: she could join a group of adventurers to explore the hidden tombs and seek out ancient artifacts, hunt for riches within the lush jungles of the city, or help the city by working in its commerce industries.',
      options: {
        'good': 'Explore the hidden tombs',
        'evil': 'Hunt for riches in the jungle',
        'neutral': 'Work in commerce industries',
      },
    },
  )
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
    ipfsHash: 'QmRRMUGrbuD8eUDRcTLQ7HUWnrZ2xDEg5e2o4NxT1UDMVr',
    imageHash: 'Qmerx5j6Ep5idSzGTSa8BrhmjhaLEw9BpARGdXfFzY4eTS',
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
  const counterpart = req.body.counterpart
  const players = req.body.players
  const log = req.body.log

  const insertQuery = 'INSERT INTO history (counterpart, players, log) VALUES (?, ?, ?)'

  database.run(insertQuery, [ counterpart, players, log ], function (err) {
    if (err) {
      console.error('Error inserting data:', err)
      res.status(500).send('Error inserting data')
    } else {
      console.log('Data inserted successfully')
      res.status(200).send('Data inserted successfully')
    }
  })
})

// Read data from the history table
app.get('/read-history', (req, res) => {
  const selectQuery = 'SELECT * FROM history'

  database.all(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error reading data:', err)
      res.status(500).send('Error reading data')
    } else {
      console.log('Data retrieved successfully')
      res.status(200).json(rows)
    }
  })
})
