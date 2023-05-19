import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    tables: {
        PlanetComponent: {
            keySchema: {},
            schema: {
                theme: "string",
            },
        },
        NameComponent: "string",
        DescriptionComponent: "string",
        PriceComponent: "uint256",
        RaceComponent: "string",
        CharacterComponent: "bytes32",
        TangibleComponent: "bool",
        CountComponent: "uint256",
        LocationComponent: {
            schema: {
                at: "string",
            },
        },
    },
    modules: [
        {
            name: "UniqueEntityModule",
            root: true,
            args: [],
        },
    ],
});
