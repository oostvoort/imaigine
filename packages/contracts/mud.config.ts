import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    systems: {
    },
    enums: {
      VotingStatusType: ["NOT_ACCEPTING_VOTES", "OPEN", "CLOSED"],
      InteractionType: ["NOT_INTERACTABLE", "SINGLE", "MULTIPLE"]
    },
    tables: {
        StoryComponent: "bool",
        ConfigComponent: "string",
        ItemComponent: "bool",
        OwnerComponent: "bytes32",
        AliveComponent: "bool",
        NameComponent: "string",
        SummaryComponent: "string",
        ImageComponent: "string",
        PriceComponent: "uint256",
        CharacterComponent: "bool",
        TangibleComponent: "bool",
        CountComponent: "uint256",
        PlayerComponent: "bool",
        LocationComponent: "bytes32",
        SceneComponent: "bool",
        KarmaPointsComponent: "int8",
        InteractableComponent: "bytes32",
        InteractionTypeComponent: "InteractionType",
        SingleInteractionComponent: {
          keySchema: {
            player: "bytes32",
            interactable: "bytes32"
          },
          schema: {
            available: "bool",
            choice: "uint256",
            processingTimeout: "uint256",
          }
        },
        MultiInteractionComponent: {
          schema: {
            available: "bool",
            playerCount: "uint256", // keeps track of how many players there are
            processingTimeout: "uint256",
            players: "bytes", // abi encoded bytes32 of all the players
            choices: "bytes", // abi encoded uint256 of all the players choices
            timeouts: "bytes" // abi encoded uint256 of when players will timeout
          }
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
