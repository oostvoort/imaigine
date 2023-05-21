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
        ControllerSystem: {
            name: "ControllerSystem",
            openAccess: false, // a private system
            accessList: [] // should only be available to deployer
        }
    },
    tables: {
        ControllerComponent: {
            keySchema: {},
            schema: {
                oracle: "address"
            },
        },
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
