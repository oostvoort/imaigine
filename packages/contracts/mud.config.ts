import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    systems: {
        LocationSystem: {
            name: "LocationSystem",
            openAccess: false, // it's a subsystem
            accessList: [] // TODO: the oracle
        },
        StorySystem: {
            name: "StorySystem",
            openAccess: false, // a private system
            accessList: [] // TODO: the oracle
        },
    },
    tables: {
        PlanetComponent: {
            keySchema: {},
            schema: {
                name: "string",
                theme: "string",
            },
        },
        StoryComponent: {
            schema: {
                themeID: "bytes32", // keccak256(theme)
                racesID: "bytes32", // Store available races to occur on story
                currencyID: "bytes32", // The currency
            },
        },
        NameComponent: "string",
        SummaryComponent: "string",
        DescriptionComponent: "string",
        ImageComponent: "string",
        PriceComponent: "uint256",
        RaceComponent: "string",
        CharacterComponent: "bytes32",
        TangibleComponent: "bool",
        CountComponent: "uint256",
        PlayerComponent: "bool",
        LocationComponent: {
            schema: {
                at: "string",
            },
        },
        AttributeUintComponent: {
            keySchema: {
                entityID: "bytes32",
                attributeID: "bytes32",
            },
            schema: {
                value: "uint256",
            },
        },
        AttributeStringComponent: {
            keySchema: {
                entityID: "bytes32",
                attributeID: "bytes32",
            },
            schema: {
                value: "string",
            },
        },
        StoryActionComponent: {
            keySchema: {
                entityID: "bytes32",
                actionID: "bytes32",
            },
            schema: {
                value: "bytes",
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
