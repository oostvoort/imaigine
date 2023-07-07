// PLAYER
import { worldContract } from '../contract'

export const generateMockPlayer = () => {
  return {
    ipfsHash: 'QmT23hETEuddnXWoCn4veVtFKkaWLbbyKFfqbi5DwbJZr9',
    visualSummary: 'Curious Elf, Feeble Strength, Clumsy Dexterity, Sturdy Constitution, Genius Intelligence, Average Charisma, Foolish Wisdom, Soft Pale Skin',
    locationId: '0x5b3fcd39522558e0c435d694c2a3e891b15253046043a36baef66738099e2802'
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
