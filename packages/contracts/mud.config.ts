import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    systems: {
    },
    tables: {
        StoryComponent: {
            schema: {
                themeID: "bytes32", // keccak256(theme)
                currencyID: "bytes32", // The currency
                racesID: "bytes", // Store available races to occur on story
            },
        },
        ItemComponent: "bool",
        OwnerComponent: "bytes32",
        AliveComponent: "bool",
        NameComponent: "string",
        SummaryComponent: "string",
        ImageComponent: "string",
        PriceComponent: "uint256",
        RaceComponent: "bool",
        CharacterComponent: "bool",
        TangibleComponent: "bool",
        CountComponent: "uint256",
        PlayerComponent: "bool",
        LocationComponent: "bytes32",
        SceneComponent: "bool",
        PathComponent: "bool",
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
        PossibleComponent: {
            keySchema: {
              interactingEntityID: "bytes32",
              interactedEntityID: "bytes32",
            },
            schema: {
              createdAt: "uint256",
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
        AttributeIntComponent: {
            keySchema: {
                entityID: "bytes32",
                attributeID: "bytes32",
            },
            schema: {
                value: "int256",
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
