import {extractJsonFromResponse} from "./extractJsonFromResponse";
import {AILocation, generateLocation} from "./generate/generateLocation";
import {AIWorld, generateWorld} from "./generate/generateWorld";
import {AICharacter, generateCharacter} from "./generate/generateCharacter";

describe('World Generation', function () {
    this.timeout(0)

    const world: AIWorld = {
        theme: "fantasy",
        races: ['elves', 'orcs', 'humans'],
        description: "",
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
        world.description = jsonResponse.description
        console.log(world)
    });

    it('should generate a location within the world', async function () {
        const location: AILocation = {
            name: "",
            characters: [],
            description: "",
            items: [],
        }

        const jsonResponse = await generateLocation({
            biome: 'Mountainous',
            world: {name: world.name, description: world.description},
            wealthLevel: "Very Rich",
            safetyLevel: "Somewhat dangerous",
            populationSize: "Medium",
            naturalResources: "rare minerals"
        })

        location.name = jsonResponse.name
        location.description = jsonResponse.description

        world.locations.push(location)

        console.log(world)
    });

    it('should generate a character in that location within the world', async function () {
        const character: AICharacter = {
            name: "Lyra",
            description: "",
            stats: {
                strength: 1,
                dexterity: 5,
                constitution: 1,
                intelligence: 1,
                charisma: 1,
                wisdom: 1,
            },
            story: {
                pet: 'Dragon',
                activity: 'Climbing Mountains',
                history: ''
            },
            physicalFeatures: {
                ageGroup: 'Adult',
                body:"Muscular",
                eyes:"Green",
                hair:"Red mohawk",
                height: "Medium",
                race: "Elf"
            },
            items: []
        }
        const _location = world.locations[0];

        const jsonResponse = await generateCharacter({
            stats: character.stats,
            story: character.story,
            world: {description: world.description, name:world.name},
            location: {description: _location.description, name: _location.name},
            physicalFeatures: {
                ageGroup: 'Adult',
                body:"Muscular",
                eyes:"Green",
                hair:"Red mohawk",
                height: "Medium",
                race: "Elf"
            }
        })

        character.name = jsonResponse.name
        character.description = jsonResponse.description
        _location.characters.push(character)
        console.log(world)
        console.log(world)
    });


});
