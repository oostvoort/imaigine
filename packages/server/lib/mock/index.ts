// PLAYER
import { worldContract } from '../contract'
import { getFromIpfs } from '../../utils/getFromIpfs'
import { Based, InteractNpcProps } from 'types'
import { fetchHistoryLogs, fetchInteraction, insertHistoryLogs, insertInteraction } from '../db'

export const generateMockPlayer = () => {
  return {
    ipfsHash: 'QmT23hETEuddnXWoCn4veVtFKkaWLbbyKFfqbi5DwbJZr9',
    visualSummary: 'Curious Elf, Feeble Strength, Clumsy Dexterity, Sturdy Constitution, Genius Intelligence, Average Charisma, Foolish Wisdom, Soft Pale Skin',
    locationId: '0x5050b8f8ad0565317ac83af0ace172433e2c59b55222906fe5696c7a3ed63cfa'
  }
}

export const generateMockPlayerImage = () => {
  return { imageIpfsHash: 'QmUJg5ZfHkM7TbgRcQAohYqmPzYXJ3sKvzhFMWiXBVQ9zb' }
}

// INTERACTION
const RANDOM_SCENARIOS = [
  {
    scenario: 'A cat on the side is drowning',
    options: {
      good: {
        choice: 'Try and rescue it',
        effect: 'The cat is saved and you are hailed as the hero of the year'
      },
      evil: {
        choice: 'Throw electric eels',
        effect: 'The cat dies and its owner sues you'
      },
      neutral: {
        choice: 'Ignore it',
        effect: 'The cat dies and the owner grieves'
      }
    }
  },
  {
    scenario: 'You arrive in the wondrous land of this place and see a bunch of prancing elves',
    options: {
      good: {
        choice: 'Dance with the elves',
        effect: 'They grant you wisdom beyond compare'
      },
      evil: {
        choice: 'Make fun of the elves',
        effect: 'You go into a slumber of two weeks'
      },
      neutral: {
        choice: 'Ignore them',
        effect: 'Nothing happens'
      }
    }
  },
  {
    scenario: 'You arrive at a house and you go inside. Suddenly, you go hungry. There are three porridges on the table.',
    options: {
      good: {
        choice: 'Add more ingridients to the porridge',
        effect: 'The bears living inside become your friend'
      },
      evil: {
        choice: 'Add poison to the porridge',
        effect: 'The bears die and you now own the house'
      },
      neutral: {
        choice: 'Eat the porridge',
        effect: 'You\'re now full'
      }
    }
  },
  {
    scenario: 'You become entralled with a pretty bird on the side and suddenly crash into some ogres.',
    options: {
      good: {
        choice: 'Apologize',
        effect: 'The ogres demand you give them the bird'
      },
      evil: {
        choice: 'Kill them',
        effect: 'You become a hero to the terrorized nearby villagers'
      },
      neutral: {
        choice: 'Run away',
        effect: 'You lose the bird'
      }
    }
  },
]

export const generateMockLocationInteraction = async (playerEntityId: string) => {
  const choice = await worldContract.getPlayerChoiceInSingleInteraction(playerEntityId)

  if (choice.toNumber()) await worldContract.openInteraction(playerEntityId)
  return RANDOM_SCENARIOS[Math.floor(Math.random() * RANDOM_SCENARIOS.length)]
}

const RANDOM_DIALOG = [
  {
    response: 'Cats are very overrated. I think you should adopt a dog',
    goodChoice: 'Think about it',
    evilChoice: 'Tell him/her to shut up',
    neutralChoice: 'Just nod',
    goodResponse: 'Okay. I\'ll think about it',
    evilResponse: 'Shut up!',
    neutralResponse: 'Okay my dude.'
  },
  {
    response: 'Maybe you should think about who to target first. I suggest going after Margaret.',
    goodChoice: 'Defend Margaret',
    evilChoice: 'Plan to kill Margaret',
    neutralChoice: 'Simply look on',
    goodResponse: 'Killing is wrong. We should always try to not kill.',
    evilResponse: 'That is exactly what I was thinking. Let\'s try to kill her together.',
    neutralResponse: 'What?'
  },
  {
    response: 'Let\'s go to the beach together.',
    goodChoice: 'Agree to go',
    evilChoice: 'Disagree vehemently',
    neutralChoice: 'Say you\'re too busy',
    goodResponse: 'Sure. Why not?',
    evilResponse: 'No, I don\'t like you',
    neutralResponse: 'Sorry. My cat\'s dog got sick. How about we reschedule.'
  },
  {
    response: 'How\'s the weather?',
    goodChoice: 'Converse mindlessly',
    evilChoice: 'Don\'t respond',
    neutralChoice: 'Try to talk about something else',
    goodResponse: 'It\'s been great surfing weather. I love the way the sea meets the sky.',
    evilResponse: '...',
    neutralResponse: 'I like pie!'
  },
  {
    response: 'Did you hear about Joanna?',
    goodChoice: 'Don\'t gossip',
    evilChoice: 'Gossip with the intention of destroying Joanna',
    neutralChoice: 'Shake head',
    goodResponse: 'I don\'t think it\'s right to talk about her in this manner',
    evilResponse: 'It feels so good to know that finally she\'s showing her beard. Oops...you weren\'t supposed to know that',
    neutralResponse: 'Not, really.'
  }
]

export const generateMockNpcInteraction = async (props: InteractNpcProps) => {
    const npc: Based = await getFromIpfs(props.npcIpfsHash)
    const conversations = await fetchHistoryLogs(props.npcEntityId)
    let history = ''

    if (conversations.length <= 0) {
      const npcInteraction = RANDOM_DIALOG[Math.floor(Math.random() * RANDOM_DIALOG.length)]

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

      return {
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
      }
    } else {
      const choice = await worldContract.winningChoice(props.npcEntityId)

      if (choice.toNumber() === 0) {
        // not yet available
        // return conversation and history
        const historyLogs = await fetchHistoryLogs(props.npcEntityId)
        const interaction = await fetchInteraction(props.npcEntityId)

        return {
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
        }

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

        const newNpcInteraction = RANDOM_DIALOG[Math.floor(Math.random() * RANDOM_DIALOG.length)]

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

        return {
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
        }

      } else {
        throw new Error(`Error on choice ${choice}`)
      }
    }
}
