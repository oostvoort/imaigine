import {getRandomValue} from "../../utils/getRandomValue";

const wealthLevels = [ 'Poor', 'Lower Middle Class', 'Middle Class', 'Upper Middle Class', 'Wealthy' ]
const populationSizes = [ 'Small', 'Medium', 'Large', 'Very Large', 'Metropolis' ]
const safetyLevels = [ 'Unsafe', 'Moderately Safe', 'Safe', 'Very Safe', 'Highly Secure' ]
const biomes = [ 'Tropical Rainforest', 'Temperate Forest', 'Taiga', 'Desert', 'Savanna', 'Grassland', 'Tundra', 'Mediterranean', 'Chaparral', 'Wetland', 'Coral Reef', 'Mountain', 'Prairie', 'Arctic', 'Mangrove', 'Steppe', 'Boreal Forest', 'Shrubland', 'Swamp', 'Estuary', 'Salt Marsh', 'Cave', 'Volcano', 'Oasis', 'Canyon', 'Plateau' ]

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
const races = [ 'elf', 'goblin', 'human', 'nymph', 'dwarf', 'troll' ]

const skinColor = ['light', 'Tan', 'Medium', 'Dark', 'Ebony']



export const strengthLevels = [ 'Feeble', 'Average', 'Mighty', 'Powerful', 'Herculean' ]
export const dexterityLevels = [ 'Clumsy', 'Nimble', 'Agile', 'Graceful', 'Acrobatic' ]
export const constitutionLevels = [ 'Frail', 'Healthy', 'Sturdy', 'Resilient', 'Indomitable' ]
export const intelligenceLevels = [ 'Ignorant', 'Average', 'Intelligent', 'Brilliant', 'Genius' ]
export const wisdomLevels = [ 'Foolish', 'Discerning', 'Wise', 'Insightful', 'Enlightened' ]
export const charismaLevels = [ 'Awkward', 'Average', 'Charismatic', 'Charming', 'Persuasive' ]


export const storyPrompt = `
    Generate a 3 paragraph description of a {theme} world.\n
    The world is populated by {races}\n
    The distinctive currency known as {currency} is in circulation.\n
    Summarize the story's world visually\n
`
export const locationPrompt = `
    Given the following world description:\n
    {storySummary}\n
    Generate a 3 paragraph description of a location named {locationName} in {storyName}.\n
    Describe it's history within the world.\n\n

    And must have the following features:\n
    It is in a ${getRandomValue(biomes)} biome.\n
    It's population size is ${getRandomValue(populationSizes)}\n
    It's safety level is ${getRandomValue(safetyLevels)}\n
    It's wealth level is ${getRandomValue(wealthLevels)}\n\n

    Summarize the location visually\n
`

export const nonPlayerCharacterPrompt = `
    Generate a character description based on the following:\n\n

    The character lives in {storyName} with the description "{storyDescription}"\n
    Don't include the world description in the character description.\n\n

    They start in a location named "{locationName}" with the description "{locationDescription}"\n
    Don't include the location description in the character description.\n
    Describe how the character is related to the location, like how they lived or came to that place.\n

    The character possesses the following stats:\n
    Strength: ${getRandomValue(strengthLevels)}\n
    Dexterity: ${getRandomValue(dexterityLevels)}\n
    Constitution: ${getRandomValue(constitutionLevels)}\n
    Intelligence: ${getRandomValue(intelligenceLevels)}\n
    Charisma: ${getRandomValue(charismaLevels)}\n
    Wisdom: ${getRandomValue(wisdomLevels)}\n\n

    The character is a ${getRandomValue(ageGroup)}\n
    The character identifies as ${getRandomValue(genderIdentity)}\n
    The character is a ${getRandomValue(races)}\n
    The character has a ${getRandomValue(skinColor)} skin color\n
    The character has a ${getRandomValue(bodyType)} body type\n\n

    The character's favorite color is ${getRandomValue(favColor)}\n\n

    Create an appropriate standard greeting message they will use when talking to others.\n\n

    Give the character a unique name based on all the information.\n\n

    Describe the character visually
`

export const playerCharacterPrompt = `
    Generate a character description based on the following:\n\n

    The character lives in {storyName} with the description "{storyDescription}"\n
    Don't include the world description in the character description.\n\n

    They start in a location named "{locationName}" with the description "{locationDescription}"\n
    Don't include the location description in the character description.\n
    Describe how the character is related to the location, like how they lived or came to that place.\n

    The character possesses the following stats:\n
    Strength: ${getRandomValue(strengthLevels)}\n
    Dexterity: ${getRandomValue(dexterityLevels)}\n
    Constitution: ${getRandomValue(constitutionLevels)}\n
    Intelligence: ${getRandomValue(intelligenceLevels)}\n
    Charisma: ${getRandomValue(charismaLevels)}\n
    Wisdom: ${getRandomValue(wisdomLevels)}\n\n

    The character is a {ageGroup}\n
    The character identifies as {genderIdentity}\n
    The character is a {race}\n
    The character has a {skinColor} skin color\n
    The character has a {bodyType} body type\n\n

    The character's favorite color is {favColor}\n\n

    Create an appropriate standard greeting message they will use when talking to others.\n\n

    Give the character a unique name based on all the information.\n\n

    Describe the character visually
`

export const locationInteractionPropmt = `
  Consider a world called "{storyName}". {storySummary}\n
  "{locationName}" is a location in {storyName}. The following is its description:\n
  "{locationSummary}"\n
  {locationHistory}
  Consider that the main character is {playerName} is in this location.\n
`

export const npcInteractionPrompt = `
  Consider a world called "{storyName}". {storySummary}\n
  Consider "{npcName}" an non player character with the following description: "{npcSummary}"\n
  "{conversationHistory}"

  Consider that the non player character (NPC) is having a conversation with the player.\n
  Make the npc responses based on it's personality
`
