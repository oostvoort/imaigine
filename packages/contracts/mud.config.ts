import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    systems: {
        LocationSystem: {
            name: "LocationSystem",
            openAccess: false, // it's a subsystem
            accessList: [] // TODO: the oracle
        }
    },
    tables: {
        PlanetComponent: {
            keySchema: {},
            schema: {
                name: "string",
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
