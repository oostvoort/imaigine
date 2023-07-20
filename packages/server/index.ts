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
  generateLocation,
  generateNonPlayerCharacter,
  generatePlayerCharacter,
  generateStory,
  generateTravel,
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
import { summarizedHistory, summarizeText } from './lib/langchain/utils'
import {
  generateActions,
  generateActionsMessages,
  generateNpcMessage,
} from './lib/langchain/nonPlayerCharacterInteraction'

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
            mode: 'action',
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
            good_effect: '-',
          })

          await worldContract.openInteraction(props.playerEntityId)

          res.send({
            scenario: generatedInteractionWithChoice.scenario,
            choice: {
              good: generatedInteractionWithChoice.actions.positive,
              evil: generatedInteractionWithChoice.actions.negative,
              neutral: generatedInteractionWithChoice.actions.neutral,
            },
          } as LocationInteractionResponse)
        } else {
          res.send('Invalid choice!')
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
      const interaction = await fetchInteraction(props.npcEntityId)
      if (interaction.length <= 0) {
        const message = await generateNpcMessage(npc)
        const actions = await generateActions(message)
        const messages = await generateActionsMessages(npc, message, actions)


        await insertInteraction({
          interactable_id: props.npcEntityId,
          scenario: message,
          good_choice: actions.positive,
          good_effect: messages.positive,
          evil_choice: actions.negative,
          evil_effect: messages.negative,
          neutral_choice: actions.neutral,
          neutral_effect: messages.neutral,
        })

        await insertHistoryLogs({
          interactable_id: props.npcEntityId,
          player_log: message,
          by: 'interactable',
          mode: 'dialog',
          players: `${props.playerEntityId}}`,
        })

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
            evil: { evilChoise: actions.negative, evilResponse: messages.negative },
            good: { goodChoise: actions.positive, goodResponse: messages.positive },
            neutral: { neutralChoise: actions.neutral, neutralResponse: messages.neutral },
          },
        } as InteractNpcResponse)
      } else {
        const choice = await worldContract.winningChoice(props.npcEntityId)

        if (choice.toNumber() === 0) {
          const logs = await fetchHistoryLogs(props.npcEntityId)
          res.send({
            conversationHistory: logs.map((convo: any) => {
              return {
                logId: convo.log_id,
                by: convo.by,
                text: convo.player_log,
              }
            }),
            option: {
              evil: { evilChoise: interaction[0].evil_choice, evilResponse: interaction[0].evil_effect },
              good: { goodChoise: interaction[0].good_choice, goodResponse: interaction[0].good_effect },
              neutral: { neutralChoise: interaction[0].neutral_choice, neutralResponse: interaction[0].neutral_effect },
            },
          } as InteractNpcResponse)
        } else if (choice.toNumber() >= 1 && choice.toNumber() <= 3) {
          const pastLogs = await fetchHistoryLogs(props.npcEntityId)
          const textLogs: string[] = []
          let prePastConversation = ``

          const effect = `${interaction[0][`${choice.toNumber() === 1 ? 'evil' : choice.toNumber() === 2 ? 'neutral' : 'good'}_effect`]}`

          // TODO: limit for last conversation and the conversation to be summarized!
          pastLogs.map((convo: any) => textLogs.push(`${convo.by === 'interactable' ? npc.name : 'adventurer'}: ${convo.player_log}`))
          textLogs.push(`adventurer: ${effect}`)
          textLogs.map((convo: any) => prePastConversation += `${convo}\n`)

          const newMessage = await generateNpcMessage(npc, prePastConversation)
          const newActions = await generateActions(newMessage)
          const newActionsMessages = await generateActionsMessages(npc, newMessage, newActions)

          await insertHistoryLogs({
            interactable_id: props.npcEntityId,
            by: 'player',
            mode: 'dialog',
            player_log: effect,
            players: `${props.playerEntityId}`,
          })

          await insertHistoryLogs({
            interactable_id: props.npcEntityId,
            by: 'interactable',
            mode: 'dialog',
            player_log: newMessage,
            players: `${props.playerEntityId}`,
          })

          await insertInteraction({
            interactable_id: props.npcEntityId,
            scenario: newMessage,
            good_choice: newActions.positive,
            good_effect: newActionsMessages.positive,
            evil_choice: newActions.negative,
            evil_effect: newActionsMessages.negative,
            neutral_choice: newActions.neutral,
            neutral_effect: newActionsMessages.neutral,
          })

          const conversations = await fetchHistoryLogs(props.npcEntityId)

          await worldContract.openInteraction(props.playerEntityId[0])

          res.send({
            conversationHistory: conversations.map((convo: any) => {
              return {
                logId: convo.log_id,
                by: convo.by,
                text: convo.player_log,
              }
            }),
            option: {
              evil: { evilChoise: newActions.negative, evilResponse: newActionsMessages.negative },
              good: { goodChoise: newActions.positive, goodResponse: newActionsMessages.positive },
              neutral: { neutralChoise: newActions.neutral, neutralResponse: newActionsMessages.neutral },
            },
          } as InteractNpcResponse)
        }else {
          res.send("Choice no 4")
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
    const travelStory = props.mock ? 'You are now travelling' : await generateTravel(locationDetails)
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

    const generatedHistory = await summarizedHistory(historyText)

    res.send({ history: generatedHistory })
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



