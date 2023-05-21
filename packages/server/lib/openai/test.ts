import {
    AICharacter,
    charismaLevels,
    constitutionLevels,
    dexterityLevels,
    generateNonPlayerCharacter,
    generatePlayerCharacter,
    intelligenceLevels,
    strengthLevels,
    wisdomLevels
} from "./generate/generateCharacter";
import {AILocation, generateLocation} from "./generate/generateLocation";
import {AIWorld, generateWorld} from "./generate/generateWorld";
import fs from 'fs-extra'
import {getRandomValue} from "./utils";

describe('World Generation', function () {
    this.timeout(0)

    const world: AIWorld = {
        theme: "fantasy",
        races: ['elves', 'orcs', 'humans'],
        summary: "",
        name: "",
        locations: [],
    }

    it('should generate a world', async function () {
        const jsonResponse = await generateWorld({
            currency: 'gold',
            races: world.races,
            theme: world.theme,
            extraDescriptions: [
                'has 2 moons',
                'has primitive to aetherpunk technology',
                'has an ongoing war between demon king and the church',
                'has 7 continents'
            ]
        })
        world.name = jsonResponse.name
        world.summary = jsonResponse.summary
        console.log(world)
    });

    it('should generate a location within the world', async function () {
        const location: AILocation = {
            name: "",
            characters: [],
            summary: "",
            items: [],
        }

        const jsonResponse = await generateLocation({
            world: {name: world.name, summary: world.summary},
        })

        location.name = jsonResponse.name
        location.summary = jsonResponse.summary

        world.locations.push(location)

        console.log(world)
    });

    it('should generate a player character in that location within the world', async function () {
        const character: AICharacter = {
            name: "Lyra",
            summary: "",
            stats: {
                strength: "Feeble",
                dexterity: "Nimble",
                constitution: "Sturdy",
                intelligence: "Brilliant",
                charisma: "Enlightened",
                wisdom: "Charismatic",
            },
            story: {
                favColor: "Green"
            },
            physicalFeatures: {
                ageGroup: "Adult",
                genderIdentity: "Female",
                race: "Human",
                bodyType: "Athletic",
                height: "Short",
                hairLength: "PixieCut",
                hairType: "Wavy",
                hairColor: "Brown",
                eyeShape: "Almond",
                eyeColor: "Green",
            },
            items: [],
            initialMessage: "",
            closingMessage: "",
        }
        const _location = world.locations[0];

        const jsonResponse = await generatePlayerCharacter({
            stats: character.stats,
            story: character.story,
            physicalFeatures: character.physicalFeatures,
            world: world,
            location: _location
        })

        character.name = jsonResponse.name
        character.summary = jsonResponse.summary
        character.initialMessage = jsonResponse.initialMessage
        character.closingMessage = jsonResponse.closingMessage

        _location.characters.push({
            name: character.name,
            summary: character.summary,
            stats: character.stats,
            initialMessage: character.initialMessage,
            closingMessage: character.closingMessage
        })
    });

    it('should generate a non player character in that location within the world', async function () {
        const character: AICharacter = {
            name: "Lyra",
            summary: "",
            stats: {
                strength: getRandomValue(strengthLevels),
                dexterity: getRandomValue(dexterityLevels),
                constitution: getRandomValue(constitutionLevels),
                intelligence: getRandomValue(intelligenceLevels),
                charisma: getRandomValue(charismaLevels),
                wisdom: getRandomValue(wisdomLevels),
            },
            story: {
                favColor: ""
            },
            physicalFeatures: {
                ageGroup: "",
                genderIdentity: "",
                race: "",
                bodyType: "",
                height: "",
                hairLength: "",
                hairType: "",
                hairColor: "",
                eyeShape: "",
                eyeColor: "",
            },
            items: [],
            closingMessage: "",
            initialMessage: ""
        }

        const _location = world.locations[0];

        const jsonResponse = await generateNonPlayerCharacter({
            world: world,
            location: _location,
            stats: character.stats
        })

        character.name = jsonResponse.name
        character.summary = jsonResponse.summary
        character.initialMessage = jsonResponse.initialMessage
        character.closingMessage = jsonResponse.closingMessage

        _location.characters.push({
            name: character.name,
            summary: character.summary,
            stats: character.stats,
            initialMessage: character.initialMessage,
            closingMessage: character.closingMessage
        })
    });

    after(function () {
        writeJsonObjectToFile(world)
    });
});


function writeJsonObjectToFile(jsonObject: any) {
    try {
        const jsonString = JSON.stringify(jsonObject, null, 2);
        fs.writeFileSync('sample_world.json', jsonString);
        console.log('JSON object written to file successfully.');
    } catch (error) {
        console.error('Error writing JSON object to file:', error);
    }
}
