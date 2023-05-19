import {extractJsonFromResponse} from "./extractJsonFromResponse";
import {generateLocation, Location} from "./generate/generateLocation";
import {generateWorld, World} from "./generate/generateWorld";
import {Character, generateCharacter} from "./generate/generateCharacter";

describe('World Generation', function () {
    this.timeout(0)

    const world: World = {
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

    it('should generate a desert location within the world', async function () {
        const location: Location = {
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
        const character: Character = {
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
        console.log(world)
    });


});
