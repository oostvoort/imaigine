import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    systems: {
    },
    enums: {
      InteractionType: ["NOT_INTERACTABLE", "SINGLE", "MULTIPLE"],
      TravelStatus: ["NOT_TRAVELLING", "PREPARING", "READY_TO_TRAVEL", "TRAVELLING"]
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
        MapCellComponent: "uint256",
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
        RevealedCellsComponent: "bytes", // array of uint256 of locationIds the player has visited
        TravelComponent: {
          schema: {
            status: "TravelStatus",
            destination: "uint256",
            lastTravelledTimestamp: "uint256",
            path: "bytes", // array of uint256 of locationIds
            toRevealAtDestination: "bytes" // array of cells that will reveal itself once player is in the new location
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
