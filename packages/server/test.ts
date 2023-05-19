import {AIWorld, generateWorld} from "./lib/openai/generate/generateWorld";
import {extractJsonFromResponse} from "./lib/openai/extractJsonFromResponse";
import {AILocation, generateLocation} from "./lib/openai/generate/generateLocation";
import {AICharacter, generateCharacter} from "./lib/openai/generate/generateCharacter";
import {setup} from "./lib/mud/setup";

describe('World Generation', function () {
    this.timeout(0)

    let network
    let components
    let systemCalls: any

    before(async function () {
        const mud = await setup()
        network = mud.network
        components = mud.components
        systemCalls = mud.systemCalls
    });

    const world: AIWorld = {
        theme: "fantasy",
        races: ['elves', 'orcs', 'humans'],
        currency: "gold",
        description: "",
        name: "",
        locations: []
    }

    it('should generate a world', async function () {
        const description = await generateWorld({
            currency: world.currency,
            races: world.races,
            theme: world.theme
        })
        world.description = description

        const json = await extractJsonFromResponse(description, ['name'])
        if (!json.name) throw new Error("Was not able to extract name")
        world.name = json.name

        console.log(world)
    });

    it('should create world in mud', function () {
        systemCalls.createPlanet(world.theme)
    });

    it('should generate a Mountainous location within the world', async function () {
        const location: AILocation = {
            name: "",
            characters: [],
            description: "",
            items: []
        }

        const description = await generateLocation({
            biome: 'Mountainous',
            world: world
        })
        location.description = description

        const json = await extractJsonFromResponse(description, ['name'])
        if (!json.name) throw new Error("Was not able to extract name")
        location.name = json.name

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
                age: 'Adult',
                pet: 'Dragon',
                food: 'Taco',
                activity: 'Climbing Mountains',
                alignment: 'Good',
            },
            items: []
        }
        const _location = world.locations[0];

        const description = await generateCharacter({
            name: character.name,
            stats: character.stats,
            story: character.story,
            location: _location
        })
        character.description = description

        // const json = await extractJsonFromResponse(description, ['name'])
        // if (!json.name) throw new Error("Was not able to extract name")
        // character.name = json.name

        _location.characters.push(character)
    });


});
