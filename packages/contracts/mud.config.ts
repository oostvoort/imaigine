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
        StoryComponent: {
            schema: {
                themeID: "bytes32", // keccak256(theme)
                racesID: "bytes32", // Store available races to occur on story
                currencyID: "bytes32", // The currency
            },
        },
        AliveComponent: "bool",
        NameComponent: "string",
        SummaryComponent: "string",
        DescriptionComponent: "string",
        ImageComponent: "string",
        PriceComponent: "uint256",
        RaceComponent: "string",
        CharacterComponent: "bool",
        TangibleComponent: "bool",
        CountComponent: "uint256",
        PlayerComponent: "bool",
        LocationComponent: "bytes32",
        SceneComponent: "bool",
        PathComponent: {
            keySchema: {
                location0: "bytes32",
                location1: "bytes32",
            },
            schema: {
                value: "bool"
            }
        },
        PathLocationComponent: {
            schema: {
                location0: "bytes32",
                location1: "bytes32",
            }
        },
        InteractComponent: { // interact-able components
          schema: {
            initialMsg: "string",
            initialActions: "bytes",
            participants: "bytes", // abi encoded `participants[]`
          },
        },
        InteractionComponent: {
          keySchema: {
            interactingEntityID: "bytes32",
            interactedEntityID: "bytes32",
          },
          schema: {
            waitingFor: "bytes32", // participant to interact
            lastInteraction: "uint256", // block.timestamp
            participantsActions: "bytes",
          }
        },
        LogComponent: "string",
        ActionsComponent: { // available actions of the entities to an interact-able component
            keySchema: {
              interactingEntityID: "bytes32",
              interactedEntityID: "bytes32",
            },
            schema: {
              createdAt: "uint256", // block.timestamp
              actions: "bytes",
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
