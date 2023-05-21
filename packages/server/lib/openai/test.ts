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
import {AIStory, generateStory} from "./generate/generateStory";
import fs from 'fs-extra'
import {getRandomValue} from "./utils";
import {AIPath, generatePath} from "./generate/generatePath";

describe('World Generation', function () {
    this.timeout(0)

    const story: AIStory = {
        theme: "fantasy",
        races: ['elves', 'orcs', 'humans'],
        currency: "gold",
        summary: "",
        name: "",
        locations: [],
        paths: []
    }

    it('should generate a story', async function () {
        const jsonResponse = await generateStory({
            currency: 'gold',
            races: story.races,
            theme: story.theme,
            extraDescriptions: [
                'has 2 moons',
                'has primitive to aetherpunk technology',
                'has an ongoing war between demon king and the church',
                'has 7 continents'
            ]
        })
        story.name = jsonResponse.name
        story.summary = jsonResponse.summary
        console.log(story)
    });

    it('should generate a location within the story', async function () {
        const location: AILocation = {
            name: "",
            characters: [],
            summary: "",
            items: [],
            imgHash: "QmWPh25Q6fZ1AtM2yviYHKcGp3hqy8iA24p15pyMRA6vEp"
        }

        const jsonResponse = await generateLocation({
            story: {name: story.name, summary: story.summary},
        })

        location.name = jsonResponse.name
        location.summary = jsonResponse.summary

        story.locations.push(location)

        console.log(story)
    });

    it('should generate another location within the story', async function () {
        const location: AILocation = {
            name: "",
            characters: [],
            summary: "",
            items: [],
            imgHash: "QmWPh25Q6fZ1AtM2yviYHKcGp3hqy8iA24p15pyMRA6vEp"
        }

        const jsonResponse = await generateLocation({
            story: {name: story.name, summary: story.summary},
        })

        location.name = jsonResponse.name
        location.summary = jsonResponse.summary

        story.locations.push(location)

        console.log(story)
    });


    it('it should create a path between those two locations', async function () {
        const _location0 = story.locations[0]
        const _location1 = story.locations[1]

        const path: AIPath = {
            name: "",
            summary: ""
        }

        const jsonResponse = await generatePath({
            fromLocation: _location0,
            toLocation: _location1
        })

        path.name = jsonResponse.name
        path.summary = jsonResponse.summary
        path.fromLocation = _location0.name
        path.toLocation = _location1.name

        story.paths.push(path)

        console.log(story)
    });


    it('should generate a player character in that location within the story', async function () {
        const character: AICharacter = {
            name: "Lyra",
            summary: "",
            stats: {
                strength: "Herculean",
                dexterity: "Clumsy",
                constitution: "Frail",
                intelligence: "Ignorant",
                charisma: "Foolish",
                wisdom: "Awkward",
            },
            story: {
                favColor: "Red"
            },
            physicalFeatures: {
                ageGroup: "Adult",
                genderIdentity: "Male",
                race: "Human",
                bodyType: "Burly",
                height: "Statuesque",
                hairLength: "Bald",
                hairType: "Wavy",
                hairColor: "Red",
                eyeShape: "Upturned",
                eyeColor: "Red",
            },
            items: [],
            initialMessage: "",
            closingMessage: "",
            imgHash: "QmWPh25Q6fZ1AtM2yviYHKcGp3hqy8iA24p15pyMRA6vEp"
        }
        const _location = story.locations[0];

        const jsonResponse = await generatePlayerCharacter({
            characterStats: character.stats,
            characterStory: character.story,
            physicalFeatures: character.physicalFeatures,
            story: story,
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
            closingMessage: character.closingMessage,
            imgHash: character.imgHash
        })
    });

    it('should generate a non player character in that location within the story', async function () {
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
            initialMessage: "",
            imgHash: "QmWPh25Q6fZ1AtM2yviYHKcGp3hqy8iA24p15pyMRA6vEp"
        }

        const _location = story.locations[0];

        const jsonResponse = await generateNonPlayerCharacter({
            story: story,
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
            closingMessage: character.closingMessage,
            imgHash: character.imgHash
        })
    });

    after(function () {
        writeJsonObjectToFile(story)
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
