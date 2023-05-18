import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    tables: {
        CharacterStatsComponent: {
            schema: {
                dexterity: 'int32',
                strength: 'int32',
                constitution: 'int32',
                intelligence: 'int32',
                charisma: 'int32',
                wisdom: 'int32'
            },
        },
        CharacterStoryComponent: {
            schema: {
                name: "string",
                pet: "string",
                age: "string",
                food: "string",
                universe: "string",
                activity: "string",
                alignment: "string"
            }
        },
        Player: "bool"
    },
});
