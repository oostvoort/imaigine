import * as dotenv from 'dotenv'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import {
  BaseConfig,
  Based,
  CreatePlayerProps,
  GenerateLocationProps,
  GenerateLocationResponse,
  GenerateNpcProps,
  GenerateNpcResponse,
  GeneratePlayerImageProps,
  GeneratePlayerImageResponse,
  GeneratePlayerProps,
  GeneratePlayerResponse,
  GenerateStoryProps,
  InsertHistoryLogsParams,
  InsertInteractionParams,
  InteractLocationProps,
  InteractNpcProps,
  InteractNpcResponse,
  InteractSQLResult,
  LogSqlResult,
  StoreToIPFS,
  StoryConfig,
} from 'types'
import {
  generateLocation,
  generateLocationInteraction,
  generateNonPlayerCharacter,
  generateNpcInteraction,
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
import fs from 'fs-extra'
import { worldContract } from './lib/contract'
import { BigNumber } from 'ethers'
import { launchAndNavigateMap } from './utils/getMap'

dotenv.config()

declare global {
  interface Window {
      findNearestPath: (a: number, b: number) => number[]
  }
}

const database = new sqlite3.Database(`${process.env.DB_SOURCE}`, err => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    // Create the "history" and "location_history" tables
    database.serialize(() => {
      database.run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY,
      counterpart TEXT,
      players TEXT,
      log TEXT
    );
  `)

      database.run(`
    CREATE TABLE IF NOT EXISTS location_history (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      interactable_id TEXT,
      players TEXT,
      mode TEXT,
      by TEXT,
      player_log TEXT
    );
  `)

      database.run(`
    CREATE TABLE IF NOT EXISTS interaction (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      interactable_id TEXT,
      scenario TEXT,
      good_choice TEXT,
      good_effect TEXT,
      evil_choice TEXT,
      evil_effect TEXT,
      neutral_choice TEXT,
      neutral_effect TEXT
    );
      `)
    })

    database.run(`
    CREATE TABLE IF NOT EXISTS history_logs (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      interactable_id TEXT,
      players TEXT,
      mode TEXT,
      by TEXT,
      player_log TEXT
    );
  `)


  }
})

const app = express()
const port = 3000


app.use('/map', express.static(path.join(process.cwd(), '../fantasy-map-generator')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(
  cors({
    origin: '*',
  }),
)

let baseConfig: BaseConfig = {} as BaseConfig
let storyConfig: StoryConfig = {} as StoryConfig
let locations: Array<{ name: string, cellNumber: number }> = []

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

  console.info('TEst')

  try {
    const seed = parseInt(<string>req.query.seed)

    const filename = `${seed}.map`

    if (fs.existsSync(filename)) {
      res.send(fs.readFileSync(filename))
    } else {
      const response = await generateMap(seed)
      res.send(response)
    }


  } catch (e) {
    res.sendStatus(500)
  }
})

app.get('/get-route', async (req: Request, res: Response) => {
  const seed = 927;
  try {
    const page = await launchAndNavigateMap(seed)
    // Access the function on the page
    const result = await page.evaluate(() => {
      // Call the function on the page and return the result
      return window.findNearestPath(813,987);
    });
    res.send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


/// @dev this is basically a test for writing into the world contract
app.get('/winning-choice', async (req: Request, res: Response) => {

  res.send(
    {
      // result: await (await worldContract.openInteraction(
      //   '0x0000000000000000000000000000000000000000000000000000000000000002',
      // )).wait()
    },
  )
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

    if (locationDetails === undefined) {
      res.status(500).json({
        message: `Locations are undefined!`,
        code: 500,
      })
    }

    const location = await generateLocation({
      name: storyConfig.name,
      description: storyConfig.summary,
    }, locationDetails.name)

    const locationIpfsHash = await storeJson({
      name: location.name,
      summary: location.description,
    })

    const imageHash = await generateLocationImage(location.visualSummary)

    try {
      await (await worldContract.createLocation(locationIpfsHash, imageHash, BigNumber.from(`${props.id}`))).wait()

      res.send({
        ipfsHash: locationIpfsHash,
        imageHash: imageHash,
      } as GenerateLocationResponse)

    } catch (e) {
      const error = {
        message: `${(e.error.toString()).includes('location already exists!') ? 'Location already exists' : e.error}`,
        code: 500,
      }

      res.status(500).json(error)
    }
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

    const imageHash = await generatePlayerImage(npc.visualSummary)

    console.info("writing npc to contract...")

    await (await worldContract.createCharacter(npcIpfsHash, imageHash, props.locationId)).wait()

    res.send({
      ipfsHash: npcIpfsHash,
      imageHash: imageHash,
    } as GenerateNpcResponse)
  } catch (e) {
    console.info(e.message)
    res.sendStatus(500).json({
      message: `Error: ${e.message}`,
      code: 500,
    })
  }
})

app.post('/api/v1/generate-player', async (req: Request, res: Response, next) => {
  const props: GeneratePlayerProps = req.body

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

    res.send({
      ipfsHash: playerIpfsHash,
      visualSummary: player.visualSummary,
      locationId: startingLocation.id,
    } as GeneratePlayerResponse)

  } catch (e) {
    console.info(`Error: ${e}`)
    res.sendStatus(500).json({
      message: `Error: ${e.message}`,
      code: 500,
    })
  }
})

app.post('/api/v1/generate-player-image', async (req: Request, res: Response, next) => {
  const props: GeneratePlayerImageProps = req.body
  try {
    const imageHash = await generatePlayerImage(props.visualSummary)
    res.send({ imageIpfsHash: imageHash } as GeneratePlayerImageResponse)
  } catch (e) {
    res.sendStatus(500).json({
      message: `Error: ${e.message}`,
      code: 500,
    })
  }
})

app.post('/api/v1/create-player', async (req: Request, res: Response, next) => {
  const props: CreatePlayerProps = req.body

  try {
    try {
      console.info("Writing player to contract...")
      await (await worldContract.createPlayer(props.playerId, props.ipfsHash, props.imageIpfsHash, props.locationId)).wait()
      res.send('Player Created!')
    } catch (e) {
      res.sendStatus(500).json({
        message: `${e.message}`,
        code: 500,
      })
    }
  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/interact-location', async (req: Request, res: Response, next: NextFunction) => {
  const props: InteractLocationProps = req.body

  try {
    // get details of location, player and npc using ipfs
    const location: Based = await getFromIpfs(props.locationIpfsHash)
    const npc: Based = await getFromIpfs(props.npcIpfsHash[0])
    const player: { name: string, description: string } = await getFromIpfs(props.playerIpfsHash)

    // check interaction table if have existing interaction

    const interactions = await fetchInteraction(props.locationEntityId)
    console.info('- done getting interactions')
    let history = ''

    // need historylogs
    const historyLogs = await fetchHistoryLogs(props.locationEntityId)
    console.info('- done getting history')

    if (historyLogs.length > 0) {
      for (const historyRow of historyLogs) {
        history += historyRow.player_log + '\n'
      }
    }

    if (interactions !== undefined) {
      if (interactions.length <= 0) {
        // create one from chatgpt
        const locationInteraction = await generateLocationInteraction({
          storyName: storyConfig.name,
          storySummary: storyConfig.summary,
          locationName: location.name,
          locationSummary: location.summary,
          npcName: npc.name,
          npcSummary: npc.summary,
          playerName: player.name,
          playerSummary: player.description,
          locationHistory: history ? `Location History: "${history}" \n` : '',
        })
        console.info('- done generating scenario')

        // save the one created to interaction table
        await insertInteraction({
          interactable_id: props.locationEntityId,
          scenario: locationInteraction.scenario,
          good_choice: locationInteraction.options.good.choice,
          good_effect: locationInteraction.options.good.effect,
          evil_choice: locationInteraction.options.evil.choice,
          evil_effect: locationInteraction.options.evil.effect,
          neutral_choice: locationInteraction.options.neutral.choice,
          neutral_effect: locationInteraction.options.neutral.effect,
        })
        console.info('- done inserting interaction')

        // return the result
        res.send(locationInteraction)
      } else {

        // checking of choice
        const choice = await worldContract.getPlayerChoiceInSingleInteraction(props.playerEntityId)

        if (choice.toNumber()) {

          await insertHistoryLogs({
            interactable_id: props.locationEntityId,
            by: 'player',
            players: player.name,
            mode: 'action',
            player_log: interactions[0][`${choice.toNumber() === 1 ? 'evil' : choice.toNumber() === 2 ? 'neutral' : 'good'}_effect`],
          })

          console.info('- done inserting new history')

          const historyLogs = await fetchHistoryLogs(props.locationEntityId)
          console.info('- done getting history')

          history = ''
          for (const historyRow of historyLogs) {
            history += historyRow.player_log + '\n'
          }

          console.info({ history })

          const locationInteraction = await generateLocationInteraction({
            storyName: storyConfig.name,
            storySummary: storyConfig.summary,
            locationName: location.name,
            locationSummary: location.summary,
            npcName: npc.name,
            npcSummary: npc.summary,
            playerName: player.name,
            playerSummary: player.description,
            locationHistory: history ? `Location History: "${history}" \n` : '',
          })
          console.info('- done generating scenario')

          await insertInteraction({
            interactable_id: props.locationEntityId,
            scenario: locationInteraction.scenario,
            good_choice: locationInteraction.options.good.choice,
            good_effect: locationInteraction.options.good.effect,
            evil_choice: locationInteraction.options.evil.choice,
            evil_effect: locationInteraction.options.evil.effect,
            neutral_choice: locationInteraction.options.neutral.choice,
            neutral_effect: locationInteraction.options.neutral.effect,
          })
          console.info('- done inserting new interaction')

          await worldContract.openInteraction(props.playerEntityId)

          res.send(locationInteraction)
        } else {
          res.send({
            scenario: interactions[0].scenario,
            options: {
              good: {
                choice: interactions[0].good_choice,
                effect: interactions[0].good_effect,
              },
              evil: {
                choice: interactions[0].evil_choice,
                effect: interactions[0].evil_effect,
              },
              neutral: {
                choice: interactions[0].neutral_choice,
                effect: interactions[0].neutral_effect,
              },
            },
          })

        }
      }
    } else {
      const error = {
        message: 'Error occurred',
        code: 500,
      }

      res.status(500).json(error)
    }
  } catch (e) {
    console.info(e.message)
    res.sendStatus(500).json({
      message: `Error: ${e.message}`,
      code: 500,
    })
  }
})

app.post('/api/v1/interact-npc', async (req: Request, res: Response, next) => {
  const props: InteractNpcProps = req.body

  try {
    const npc: Based = await getFromIpfs(props.npcIpfsHash)

    const conversations = await fetchHistoryLogs(props.npcEntityId)

    let history = ''

    if (conversations.length <= 0) {
      const npcInteraction = await generateNpcInteraction({
        storyName: storyConfig.name,
        storySummary: storyConfig.summary,
        npcName: npc.name,
        npcSummary: npc.summary,
        conversationHistory: history ? `Consider a conversation history: \n ${history}` : '',
      })

      await insertInteraction({
        interactable_id: props.npcEntityId,
        scenario: npcInteraction.response,
        good_choice: npcInteraction.goodChoice,
        good_effect: npcInteraction.goodResponse,
        evil_choice: npcInteraction.evilChoice,
        evil_effect: npcInteraction.evilResponse,
        neutral_choice: npcInteraction.neutralChoice,
        neutral_effect: npcInteraction.neutralResponse,
      })
      console.info('- done inserting npc interaction')

      await insertHistoryLogs({
        interactable_id: props.npcEntityId,
        by: 'interactable',
        players: `NPC: ${npc.name}`,
        mode: 'dialog',
        player_log: `${npcInteraction.response}`,
      })

      console.info('- done inserting initial conversation history')

      const historyLogs = await fetchHistoryLogs(props.npcEntityId)

      res.send({
        conversationHistory: historyLogs.map((convo: any) => {
          return {
            logId: convo.log_id,
            by: convo.by,
            text: convo.player_log,
          }
        }),
        option: {
          good: {
            goodChoise: npcInteraction.goodChoice,
            goodResponse: npcInteraction.goodResponse,
          },
          evil: {
            evilChoise: npcInteraction.evilChoice,
            evilResponse: npcInteraction.evilResponse,
          },
          neutral: {
            neutralChoise: npcInteraction.neutralChoice,
            neutralResponse: npcInteraction.neutralResponse,
          },
        },
      } as InteractNpcResponse)
    } else {
      const choice = await worldContract.winningChoice(props.npcEntityId)

      if (choice.toNumber() === 0) {
        // not yet available
        // return conversation and history
        const historyLogs = await fetchHistoryLogs(props.npcEntityId)
        const interaction = await fetchInteraction(props.npcEntityId)

        res.send({
          conversationHistory: historyLogs.map((convo: any) => {
            return {
              logId: convo.log_id,
              by: convo.by,
              text: convo.player_log,
            }
          }),
          option: {
            good: {
              goodChoise: interaction[0].good_choice,
              goodResponse: interaction[0].good_effect,
            },
            evil: {
              evilChoise: interaction[0].evil_choice,
              evilResponse: interaction[0].evil_effect,
            },
            neutral: {
              neutralChoise: interaction[0].neutral_choice,
              neutralResponse: interaction[0].neutral_effect,
            },
          },
        } as InteractNpcResponse)

      } else if (choice.toNumber() >= 1 && choice.toNumber() <= 3) {
        // choosing between 1 to 3
        // call here the interaction

        const currentInteractionOnThisBlock = await fetchInteraction(props.npcEntityId)

        await insertHistoryLogs({
          interactable_id: props.npcEntityId,
          by: 'player',
          players: `${props.playerIpfsHash}`,
          mode: 'dialog',
          player_log: currentInteractionOnThisBlock[0][`${choice.toNumber() === 1 ? 'evil' : choice.toNumber() === 2 ? 'neutral' : 'good'}_effect`],
        })

        console.info('- done inserting new history')

        const conversations = await fetchHistoryLogs(props.npcEntityId)

        console.info('- done getting history')

        conversations.forEach((item) => {
          history += `
            ${item.by}: ${item.player_log},
        `
        })

        const newNpcInteraction = await generateNpcInteraction({
          storyName: storyConfig.name,
          storySummary: storyConfig.summary,
          npcName: npc.name,
          npcSummary: npc.summary,
          conversationHistory: history ? `Consider a conversation history: \n ${history}` : '',
        })

        await insertInteraction({
          interactable_id: props.npcEntityId,
          scenario: newNpcInteraction.response,
          good_choice: newNpcInteraction.goodChoice,
          good_effect: newNpcInteraction.goodResponse,
          evil_choice: newNpcInteraction.evilChoice,
          evil_effect: newNpcInteraction.evilResponse,
          neutral_choice: newNpcInteraction.neutralChoice,
          neutral_effect: newNpcInteraction.neutralResponse,
        })
        console.info('- done inserting new npc interaction')

        await insertHistoryLogs({
          interactable_id: props.npcEntityId,
          by: 'interactable',
          players: `NPC: ${npc.name}`,
          mode: 'dialog',
          player_log: `${newNpcInteraction.response}`,
        })

        console.info('- done inserting new conversation')

        const newConversation = await fetchHistoryLogs(props.npcEntityId)
        const latestInteraction = await fetchInteraction(props.npcEntityId)

        await worldContract.openInteraction(props.playerEntityId[0])

        res.send({
          conversationHistory: newConversation.map((convo: any) => {
            return {
              logId: convo.log_id,
              by: convo.by,
              text: convo.player_log,
            }
          }),
          option: {
            good: {
              goodChoise: latestInteraction[0].good_choice,
              goodResponse: latestInteraction[0].good_effect,
            },
            evil: {
              evilChoise: latestInteraction[0].evil_choice,
              evilResponse: latestInteraction[0].evil_effect,
            },
            neutral: {
              neutralChoise: latestInteraction[0].neutral_choice,
              neutralResponse: latestInteraction[0].neutral_effect,
            },
          },
        } as InteractNpcResponse)

      } else {
        res.sendStatus(500).json({
          message: `Error on choice ${choice}`,
          code: 500,
        })
      }
    }
  } catch (e) {
    console.info(e.message)
    res.sendStatus(500).json({
      message: `Error: ${e.message}`,
      code: 500,
    })
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
      visualSummary: 'Curious Elf, Feeble Strength, Clumsy Dexterity, Sturdy Constitution, Genius Intelligence, Average Charisma, Foolish Wisdom, Soft Pale Skin',
      locationId: '0x886b4be6a70e2eacc060d6e16947268361f95b575bec0e369c827351677ccde7',
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

app.post('/mock/api/v1/interact-npc', async (req: Request, res: Response, next) => {

  const conversations = [
    {
      logId: 1,
      by: 'interactable',
      text: 'Welcome, traveler! How can I assist you today?',
    },
    {
      logId: 2,
      by: 'player',
      text: 'I\'m looking for a rare artifact. Do you have any?',
    },
    {
      logId: 3,
      by: 'interactable',
      text: 'Ah, indeed! We recently acquired a mysterious artifact from the depths of the forest. Would you like to see it?',
    },
    {
      logId: 4,
      by: 'player',
      text: 'Yes, I would love to see it!',
    },
    {
      logId: 5,
      by: 'interactable',
      text: 'Very well, follow me to the back room. It\'s kept safely inside a glass case.',
    },
    {
      logId: 6,
      by: 'player',
      text: 'Wow, it\'s even more impressive than I imagined!',
    },
    {
      logId: 7,
      by: 'interactable',
      text: 'Indeed, it\'s one of the most remarkable artifacts we\'ve ever found. Its origin is still a mystery.',
    },
    {
      logId: 8,
      by: 'player',
      text: 'How much does it cost?',
    },
    {
      logId: 9,
      by: 'interactable',
      text: 'For you, my friend, I can offer a special price of 500 gold coins.',
    },
    {
      logId: 10,
      by: 'player',
      text: 'That\'s quite expensive. Can you lower the price?',
    },
    {
      logId: 11,
      by: 'interactable',
      text: 'I\'m sorry, but that\'s the best I can do. The artifact is truly valuable.',
    },
    {
      logId: 12,
      by: 'player',
      text: 'Alright, I\'ll take it.',
    },
    {
      logId: 13,
      by: 'interactable',
      text: 'Excellent! Here you go. May it bring you great fortune on your adventures.',
    },
  ]

  res.send({
    conversations: conversations,
    options: {
      good: {
        choice: 'Good Choice',
        effect: 'Good Effect',
      },
      evil: {
        choice: 'Evil Choice',
        effect: 'Evil Effect',
      },
      neutral: {
        choice: 'Neutral Choice',
        effect: 'Neutral Effect',
      },
    },
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

async function fetchInteraction(entityId: string): Promise<Array<InteractSQLResult> | undefined> {
  const sql = `SELECT * FROM interaction WHERE interactable_id = '${entityId}' ORDER BY log_id DESC`
  return new Promise((resolve, reject) => {
    database.all(sql, (err, rows) => {
      if (err) {
        console.error('Error reading data:', err)
        reject(undefined) // Reject the promise with the error
      } else {
        resolve(rows.map((interaction: InteractSQLResult) => {
          return {
            log_id: interaction.log_id,
            interactable_id: interaction.interactable_id,
            scenario: interaction.scenario,
            good_choice: interaction.good_choice,
            good_effect: interaction.good_effect,
            evil_choice: interaction.evil_choice,
            evil_effect: interaction.evil_effect,
            neutral_choice: interaction.neutral_choice,
            neutral_effect: interaction.neutral_effect,
          }
        }))
      }
    })
  })
}

async function insertInteraction(insertInteractionParams: InsertInteractionParams) {

  const insertQuery = `
    INSERT INTO interaction (
        interactable_id,
        scenario,
        good_choice,
        good_effect,
        evil_choice,
        evil_effect,
        neutral_choice,
        neutral_effect
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

  database.run(insertQuery, [
    insertInteractionParams.interactable_id,
    insertInteractionParams.scenario,
    insertInteractionParams.good_choice,
    insertInteractionParams.good_effect,
    insertInteractionParams.evil_choice,
    insertInteractionParams.evil_effect,
    insertInteractionParams.neutral_choice,
    insertInteractionParams.neutral_effect,

  ], function (err) {
    if (err) {
      console.error('Error inserting data:', err)
    } else {
      console.log('Data inserted successfully.')
    }
  })
}

async function fetchHistoryLogs(entityId: string): Promise<Array<LogSqlResult> | undefined> {
  const sql = `SELECT * FROM history_logs WHERE interactable_id = '${entityId}' ORDER BY log_id ASC`
  return new Promise((resolve, reject) => {
    database.all(sql, (err, rows) => {
      if (err) {
        console.error('Error reading data:', err)
        reject(undefined) // Reject the promise with the error
      } else {
        resolve(rows.map((log: LogSqlResult) => {
          return {
            log_id: log.log_id,
            interactable_id: log.interactable_id,
            players: log.players,
            mode: log.mode,
            by: log.by,
            player_log: log.player_log,
          }
        }))
      }
    })
  })
}

async function insertHistoryLogs(insertHistoryLogsParams: InsertHistoryLogsParams) {

  const insertQuery = `
    INSERT INTO history_logs (
        interactable_id,
        players,
        mode,
        by,
        player_log
    )
    VALUES (?, ?, ?, ?, ?)`

  database.run(insertQuery, [
    insertHistoryLogsParams.interactable_id,
    insertHistoryLogsParams.players,
    insertHistoryLogsParams.mode,
    insertHistoryLogsParams.by,
    insertHistoryLogsParams.player_log,
  ], function (err) {
    if (err) {
      console.error('Error inserting data:', err)
    } else {
      console.log('Data inserted successfully.')
    }
  })
}

