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
  GenerateTravelProps,
  GenerateTravelResponse,
  InteractLocationProps,
  InteractNpcProps,
  InteractNpcResponse,
  LocationInteractionResponse,
  LocationObject,
  PlayerHistoryProps,
  RouteObject,
  StoreToIPFS,
  StoryConfig,
} from 'types'
import {
  generateHistory,
  generateLocation, generateLocationInteraction,
  generateNonPlayerCharacter,
  generateNpcInteraction,
  generatePlayerCharacter,
  generateStory,
  generateTravel, summarizeText,
} from './lib/langchain'
import { generateLocationImage, generatePlayerImage } from './lib/leonardo'
import { storeJson } from './lib/ipfs'
import { getBaseConfigFromIpfs } from './utils/getBaseConfigFromIpfs'
import { getFromIpfs } from './utils/getFromIpfs'
import { getLocationDetails, getLocationList } from './utils/getLocationList'
import * as path from 'path'
import { generateMap } from './generate'
import fs from 'fs-extra'
import {
  calculateRevealedCells,
  convertLocationNumberToLocationId,
  getPlayerDestination,
  getPlayerLocation,
  startTravel,
  worldContract,
} from './lib/contract'
import { BigNumber } from 'ethers'
import { getLocations, getRoute, getToRevealCells } from './utils/getMap'
import {
  generateMockLocationInteraction,
  generateMockNpcInteraction,
  generateMockPlayer,
  generateMockPlayerImage,
} from './lib/mock'
import {
  fetchHistoryLogs,
  fetchInteraction,
  fetchPlayerHistoryLogs,
  insertHistoryLogs,
  insertInteraction,
} from './lib/db'
import { removeParentheses } from './utils/removeParentheses'
import * as process from 'process'
import { MAP_SEED } from './global/config'
import { generateEffect, generateInteractLocation } from './lib/langchain/locationInteraction'

dotenv.config()

declare global {
  interface Window {
    findNearestPath: (from: number, to: number) => number[],
    getCellInfo: (cell: number) => RouteObject,
    getToRevealCells: (currentLocation: number, exploreCells: number[]) => number[],
    getAllBurg: () => LocationObject[]
  }
}

const app = express()
const port = 3000


app.use('/map', express.static(path.join(process.cwd(), '../fantasy-map-generator')))
app.use('/', express.static(path.join(process.cwd(), './public')))

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

app.post('/generate-location-id', async (req, res, next) => {
  const props: { cellNumber: number } = req.body
  try {
    const locationId = convertLocationNumberToLocationId(props.cellNumber)
    res.send({ result: locationId })
  } catch (e) {
    res.status(500).send(e.toString())
  }
})

app.get('/mapdata', async (req: Request, res: Response, next) => {

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
    console.info(e)
    next(e)
  }
})

app.post('/get-revealed-cells', (req, res) => {
  const props: { revealedCells: string } = req.body
  try {
    const revealedCells = calculateRevealedCells(props.revealedCells)
    res.send({ revealedCells })
  } catch (e) {
    res.status(500).send(e.toString())
  }
})

app.get('/get-route', async (req: Request, res: Response) => {
  const seed = Number(MAP_SEED)
  try {
    const result = await getRoute(seed, '1', 2207, 1892)
    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
  }

})

app.get('/get-locations', async (req: Request, res: Response) => {
  const seed = Number(MAP_SEED)
  try {
    const result = await getLocations(seed)
    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
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
      next(e)
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

    console.info('writing npc to contract...')

    await (await worldContract.createCharacter(npcIpfsHash, imageHash, props.locationId)).wait()

    res.send({
      ipfsHash: npcIpfsHash,
      imageHash: imageHash,
    } as GenerateNpcResponse)
  } catch (e) {
    console.info(e.message)
    next(e)
  }
})

app.post('/api/v1/generate-player', async (req: Request, res: Response, next) => {
  const props: GeneratePlayerProps = req.body

  if (props.mock) {
    console.info('redirected to mocking data')
    res.send(generateMockPlayer())
  } else {
    console.info('generating player')
    try {

      const startingLocation = baseConfig.startingLocations[0]

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
        cellId: startingLocation.cell,
      } as GeneratePlayerResponse)

    } catch (e) {
      console.info(`Error: ${e}`)
      next(e)
    }
  }
})

app.post('/api/v1/generate-player-image', async (req: Request, res: Response, next) => {
  const props: GeneratePlayerImageProps = req.body

  if (props.mock) {
    res.send(generateMockPlayerImage())
  } else {
    try {
      const imageHash = await generatePlayerImage(props.visualSummary)
      res.send({ imageIpfsHash: imageHash } as GeneratePlayerImageResponse)
    } catch (e) {
      next(e)
    }
  }
})

app.post('/api/v1/create-player', async (req: Request, res: Response, next) => {
  const props: CreatePlayerProps = req.body
  console.log('server', props)
  try {
    try {
      console.info('- getting revealedCells...')
      const revealedCells = await getToRevealCells(props.cellId, [ props.cellId ])
      console.info('- done getting revealedCells')

      console.info(' - writing player to contract...')
      await (await worldContract.createPlayer(props.playerId, props.ipfsHash, props.imageIpfsHash, props.locationId, revealedCells)).wait()
      console.info('- done creating player')
      res.send('Player Created!')
    } catch (e) {
      next(e)
    }
  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/interact-location', async (req: Request, res: Response, next: NextFunction) => {
  const props: InteractLocationProps = req.body

  try {
    if (props.mock) res.send(await generateMockLocationInteraction(props.playerEntityId))
    else {

      const interactions = await fetchInteraction(`${props.locationEntityId}${props.playerEntityId}`)

      const location: Based = await getFromIpfs(props.locationIpfsHash)
      const player: { name: string, description: string } = await getFromIpfs(props.playerIpfsHash)

      if (interactions.length <= 0) {

        const generatedInteraction = await generateInteractLocation({
          locationHistory: 'no location history available',
          locationName: location.name,
          locationSummary: location.summary,
          playerName: player.name,
          playerSummary: player.description,
          storyName: storyConfig.name,
          storySummary: storyConfig.summary,
        })

        await insertInteraction({
          interactable_id: `${props.locationEntityId}${props.playerEntityId}`,
          scenario: generatedInteraction.scenario,
          good_choice: generatedInteraction.actions.positive,
          evil_choice: generatedInteraction.actions.negative,
          neutral_choice: generatedInteraction.actions.neutral,
          evil_effect: '-',
          good_effect: '-',
          neutral_effect: '-',
        })

        res.send({
          scenario: generatedInteraction.scenario,
          choice: {
            good: generatedInteraction.actions.positive,
            evil: generatedInteraction.actions.negative,
            neutral: generatedInteraction.actions.neutral,
          },
        } as LocationInteractionResponse)
      } else {
        const choice = await worldContract.getPlayerChoiceInSingleInteraction(props.playerEntityId)

        if (choice.toNumber() === 0) {
          res.send({
            scenario: interactions[0].scenario,
            choice: {
              good: interactions[0].good_choice,
              evil: interactions[0].evil_choice,
              neutral: interactions[0].neutral_choice,
            },
          } as LocationInteractionResponse)
        } else if (choice.toNumber() >= 1 && choice.toNumber() <= 3) {
          const action = interactions[0][`${choice.toNumber() === 1 ? 'evil' : choice.toNumber() === 2 ? 'neutral' : 'good'}_choice`]
          const effect = await generateEffect(interactions[0].scenario, action)

          await insertHistoryLogs({
            interactable_id: `${props.locationEntityId}${props.playerEntityId}`,
            players: `${props.playerEntityId}`,
            player_log: effect,
            by: 'player',
            mode: 'action'
          })

          let history = ``
          const historyLogs = await fetchHistoryLogs(`${props.locationEntityId}${props.playerEntityId}`)

          for (const historyRow of historyLogs) {
            history += historyRow.player_log + '\n'
          }

          const summary = await summarizeText(history)
          const generatedInteractionWithChoice = await generateInteractLocation({
            locationHistory: summary,
            locationName: location.name,
            locationSummary: location.summary,
            playerName: player.name,
            playerSummary: player.description,
            storyName: storyConfig.name,
            storySummary: storyConfig.summary,
          })

          await insertInteraction({
            interactable_id: `${props.locationEntityId}${props.playerEntityId}`,
            scenario: generatedInteractionWithChoice.scenario,
            good_choice: generatedInteractionWithChoice.actions.positive,
            evil_choice: generatedInteractionWithChoice.actions.negative,
            neutral_choice: generatedInteractionWithChoice.actions.neutral,
            neutral_effect: '-',
            evil_effect: '-',
            good_effect: '-'
          })

          await worldContract.openInteraction(props.playerEntityId)

          res.send({
            scenario: generatedInteractionWithChoice.scenario,
            choice: {
              good: generatedInteractionWithChoice.actions.positive,
              evil: generatedInteractionWithChoice.actions.negative,
              neutral: generatedInteractionWithChoice.actions.neutral
            }
          } as LocationInteractionResponse)
        } else {
          res.send("Invalid choice!")
        }
      }
    }

  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/interact-npc', async (req: Request, res: Response, next) => {
  const props: InteractNpcProps = req.body

  if (props.mock) res.send(await generateMockNpcInteraction(props))
  else {
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
          throw new Error(`Error on choice ${choice}`)
        }
      }
    } catch (e) {
      console.info(e.message)
      next(e)
    }
  }
})

app.post('/api/v1/generate-travel', async (req: Request, res: Response, next) => {
  const props: GenerateTravelProps = req.body


  try {

    const playerCurrentLocationId = await getPlayerLocation(props.playerEntityId)
    const playerDestinationLocationId = await getPlayerDestination(props.playerEntityId)
    // const playerDestinationLocationId = 1514

    console.info('- getting route ...')
    const data = await getRoute(Number(MAP_SEED), props.playerEntityId, playerCurrentLocationId, playerDestinationLocationId)
    console.info('- done getting route', data)

    await startTravel(props.playerEntityId, data.routeData.map(route => route.cell), data.toRevealAtDestination)

    let locationDetails = ``

    data.routeData.forEach((location) => {
      locationDetails += `
        ${location.burg === 'no' ? '' : `Location name: ${removeParentheses(location.burg)}`}
        This location is on the state of ${removeParentheses(location.state)} in the province of ${removeParentheses(location.province)} culture here is ${removeParentheses(location.culture)} and religion of ${removeParentheses(location.religion)}.
        This location is on a ${location.biome} with a latitude of ${location.latitude} and longitube of ${location.longitude} a type of ${removeParentheses(location.type)}.
        Precipitation in this location is ${location.precipitation} the are ${location.river === 'no' ? 'no rivers' : 'rivers'}. A elevation of ${removeParentheses(location.elevation)},
        dept of ${location.depth} and a temperature of ${location.temperature}.\n
            `
    })

    console.info('- generating travel ...')
    const travelStory = await generateTravel(locationDetails)
    console.info('- done generating travel')

    res.send({
      paths: data,
      travelStory: travelStory,
    } as GenerateTravelResponse)

  } catch (e) {
    next(e)
  }
})

app.post('/api/v1/get-history', async (req: Request, res: Response, next) => {
  const props: PlayerHistoryProps = req.body

  try {
    const playerHistory = await fetchPlayerHistoryLogs(props.playerEntityId)

    let historyText = ``

    playerHistory.forEach((history) => {
      historyText += `${history.player_log}\n`
    })

    const generatedHistory = await generateHistory(historyText)

    const data: { output: { history: string } } = JSON.parse(generatedHistory)

    res.send({ history: data.output.history })
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

app.post('/api/v1/ai-location-interaction', async (req: Request, res: Response, next) => {


  try {
    // const dummy = {
    //   storyName: 'Xelva',
    //   storySummary: 'Xelva is an ancient and mysterious fantasy world, populated by elves, orcs, and humans. It has two moons, one of which is often shrouded in mist and bathed in a kaleidoscope of soft and colorful light. Xelva’s technology varies from primitive magic to aetherpunk – a mix of modern and arcane technology. Its currency circulates around gold, and it has seven beautiful continents, each with its own culture and stories.But Xelva is a world at war; between the Demon King and The Church, battles rage daily. It is said that the church is blessed by a powerful angel, and that the Demon King is partnered with a powerful force of darkness. Whatever the truth may be, Xelva is a place full of adventure and mystery, ready to be explored. Visitors to Xelva can expect to discover ancient caves, enchanted jungles, and hidden tombs filled with treasure. They will see magnificent monuments soaring high into the sky, and perhaps even witness one of the legendary battles between the Demon King and The Church. Magical creatures dwell within dense forests, untold secrets await to be unraveled, and riches exist for those brave enough to seek them. Xelva awaits adventurers, ready to explore and discover its wonders. ',
    //   locationName: 'Eternal Springs',
    //   locationSummary: 'Eternal Springs is a beautiful oasis located in the estuary of Xelva. It\'s a moderately safe and wealthy metropolis consisting of clear waters, lush vegetation, and magical artifacts and creatures. The population of the city is diverse, with humans and elves living in harmony alongside adventurers, merchants, and explorers of all kinds. The city\'s wealth is drawn from multiple sources, including the river riches from the estuary and the magical secrets it harbors. Much of its population worships an ancient god known as the \'bringer of the springs\', and tales of the city\'s grandeur often appear in ancient legends and folklore. Visitors of Eternal Springs can expect to find a city of vibrant culture and grand spectacles, from the mornings when the residents celebrate beautiful sunrise rituals to the cool evenings when the moonlight illuminates their music and dance. Even the most seasoned adventurers will find a unique and immersive experience within the city.',
    //   playerName: 'Dyaella Blueleaf',
    //   playerSummary: 'Dyaella Blueleaf is a young adult elf who hails from Forsune Citadel, a fortress located in Xelva\'s boreal forests. She is acrobatic, healthy, genius, persuasive, and insightful. She has a light skin color, and an average body type. Dyaella loves adventure and secrets and seeks treasures in ancient caves, enchanted jungles, and hidden tombs. She is loyal to the community of her citadel and is colorful, always thinking of ways to make it a better home. Her favorite color is blue.',
    //   locationHistory: ``,
    //
    // }
    //
    // const summary = await summarizeText(dummy.locationHistory)
    //
    // const text = `
    //   The world name is ${dummy.storyName}, ${dummy.storySummary}\n
    //   There is a location named ${dummy.locationName}, ${dummy.locationSummary}\n
    //   ${dummy.playerName} a adventurer, ${dummy.playerSummary}\n
    //
    //   Location History: ${dummy.locationHistory}
    // `
    //
    // const scenario = await interactLocation({inputText: text})
    // const actions = await generateActions(scenario)
    // // const effect = await generateEffect(scenario, actions.negative)
    // const effect = ''
    // res.send({ scenario, actions, effect })

  } catch (e) {
    console.info(e)
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


app.post('/mock/api/v1/interact-location', async (req: Request, res: Response, next) => {
  const props: InteractLocationProps = req.body
  res.send(await generateMockLocationInteraction(props.playerEntityId))

})

app.post('/mock/api/v1/generate-player', async (req: Request, res: Response, next) => {
  res.send(generateMockPlayer())
})

app.post('/mock/api/v1/generate-player-image', async (req, res, next) => {
  res.send(generateMockPlayerImage())
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
  const props: InteractNpcProps = req.body
  res.send(await generateMockNpcInteraction(props))
})



