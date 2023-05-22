import { executePrompt } from '../executePrompt'
import {
  CharacterPhysicalFeatures,
  CharacterStats,
  CharacterStory, GenerateInteractionResponse,
  GenerateNonPlayerCharacterProps,
  GeneratePlayerCharacterProps, GeneratePlayerCharacterResponse,
} from 'types'
import { getRandomValue } from '../utils'

export interface AICharacter {
  name: string,
  summary: string,
  story: CharacterStory,
  stats: CharacterStats,
  physicalFeatures: CharacterPhysicalFeatures,
  items: Array<string>,
  initialMessage: string
  closingMessage: string,
  imgHash: string
}

export async function generatePlayerCharacter({
  location,
  physicalFeatures,
  characterStats,
  characterStory,
  story,
}: GeneratePlayerCharacterProps): Promise<GeneratePlayerCharacterResponse> {
  const prompt = `
    Generate a character description based on the following:

    The character lives in ${story.name} with the description "${story.summary}"
    Don't include the world description in the character description.

    They start in a location named "${location.name}" with the description "${location.summary}"
    Don't include the location description in the character description.
    Describe how the character is related to the location, like how they lived or came to that place.

    The character possesses the following stats:
    Strength: ${characterStats.strength}
    Dexterity: ${characterStats.dexterity}
    Constitution: ${characterStats.constitution}
    Intelligence: ${characterStats.intelligence}
    Charisma: ${characterStats.charisma}
    Wisdom: ${characterStats.wisdom}

    The character is a ${physicalFeatures.ageGroup}
    The character identifies as ${physicalFeatures.genderIdentity}
    The character is a ${physicalFeatures.race}
    The character has a ${physicalFeatures.bodyType} body type
    The character is ${physicalFeatures.height}
    The character has ${physicalFeatures.hairLength} ${physicalFeatures.hairType} ${physicalFeatures.hairColor} hair
    The character has ${physicalFeatures.eyeShape} shaped ${physicalFeatures.eyeColor} eyes

    The character's favorite color is ${characterStory.favColor}

    Create an appropriate standard greeting message they will use when talking to others.
    Create an appropriate standard goodbye message they will use when talking to others.

    Give the character a unique name based on all the information.

    Describe the character visually

    Respond only in JSON with the following format:
    {
        "name": "the name of the character",
        "summary": "the generated description",
        "initialMessage": "the standard greeting message",
        "closingMessage": "the standard goodbye message",
        "visualSummary": "a list of keywords describing the character"
    }
    `
  
  const output = await executePrompt(prompt)
  const json: GeneratePlayerCharacterResponse = JSON.parse(output)
  return json
}


const ageGroup = [ 'Child', 'Adolescent', 'Young Adult', 'Adult', 'Elderly' ]
const genderIdentity = [ 'Male', 'Female', 'Nonbinary', 'Others' ]
const bodyType = [ 'Slim', 'Average', 'Atlethic', 'Burly', 'Plump' ]
const height = [ 'Petite', 'Short', 'Average', 'Tall', 'Statuesque' ]
const hairLength = [ 'Long', 'Medium', 'Short', 'PixieCut', 'Bald' ]
const hairType = [ 'Straight', 'Wavy', 'Curly' ]
const hairColor = [ 'Black', 'Brown', 'Yellow', 'Grey', 'Red', 'Green', 'Blue' ]
const eyeShape = [ 'Almond', 'Round', 'Hooded', 'Upturned', 'Monolid' ]
const eyeColor = [ 'Black', 'Brown', 'Yellow', 'Grey', 'Red', 'Green', 'Blue' ]

const favColor = [ 'Green', 'Brown', 'Blue', 'White', 'Yellow', 'Grey', 'Red' ]

export const strengthLevels = [ 'Feeble', 'Average', 'Mighty', 'Powerful', 'Herculean' ]
export const dexterityLevels = [ 'Clumsy', 'Nimble', 'Agile', 'Graceful', 'Acrobatic' ]
export const constitutionLevels = [ 'Frail', 'Healthy', 'Sturdy', 'Resilient', 'Indomitable' ]
export const intelligenceLevels = [ 'Ignorant', 'Average', 'Intelligent', 'Brilliant', 'Genius' ]
export const wisdomLevels = [ 'Foolish', 'Discerning', 'Wise', 'Insightful', 'Enlightened' ]
export const charismaLevels = [ 'Awkward', 'Average', 'Charismatic', 'Charming', 'Persuasive' ]

export async function generateNonPlayerCharacter({ location, story, stats }: GenerateNonPlayerCharacterProps) {
  return await generatePlayerCharacter({
    location,
    physicalFeatures: {
      ageGroup: getRandomValue(ageGroup),
      genderIdentity: getRandomValue(genderIdentity),
      race: getRandomValue(story.races),
      bodyType: getRandomValue(bodyType),
      height: getRandomValue(height),
      hairLength: getRandomValue(hairLength),
      hairType: getRandomValue(hairType),
      hairColor: getRandomValue(hairColor),
      eyeShape: getRandomValue(eyeShape),
      eyeColor: getRandomValue(eyeColor),
    },
    characterStats: {
      strength: stats.strength,
      dexterity: stats.dexterity,
      constitution: stats.constitution,
      intelligence: stats.intelligence,
      charisma: stats.charisma,
      wisdom: stats.wisdom,
    },
    story: story,
    characterStory: {
      favColor: getRandomValue(favColor),
    },
  })
}
