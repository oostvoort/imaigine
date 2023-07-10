import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    systems: {
    },
    enums: {
      InteractionType: ["NOT_INTERACTABLE", "SINGLE", "MULTIPLE"],
      TravelStatus: ["NOT_TRAVELLING", "PREPARING", "READY_TO_TRAVEL", "TRAVELLING"],
      BattleStatus: ["NOT_IN_BATTLE", "IN_BATTLE", "DONE_SELECTING", "LOCKED_IN"],
      BattleOptions: ["NONE", "Sword", "Scroll", "Potion"],
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
        RevealedCells: "bytes", // will be implemented as bitmap for cells player has travelled
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
        TravelComponent: {
          schema: {
            status: "TravelStatus",
            destination: "uint256",
            lastTravelledTimestamp: "uint256",
            path: "bytes", // array of uint256 of locationIds
            toRevealAtDestination: "bytes" // array of cells that will reveal itself once player is in the new location
          }
        },
        BattleQueueComponent: {
          schema: {
            playerId: "bytes32",
          }
        },
        BattleComponent: {
          schema: {
            opponent: "bytes32",
            option: "BattleOptions",
            hashedOption: "bytes32",
            status: "BattleStatus",
            timestamp: "uint256",
            hashSalt: "string",
          }
        },
        BattleHistoryComponent: {
          keySchema: {
            id: "uint256"
          },
          schema: {
            winner: "bytes32",
            winnerOption: "BattleOptions",
            loser: "bytes32",
            loserOption: "BattleOptions",
            draw: "bool" // flag that states if winner and loser drew
          }
        },
        BattleHistoryCounter: {
          keySchema: {},
          schema: "uint256"
        },
      BattlePointsComponent: :uint256"
    },
    modules: [
        {
            name: "UniqueEntityModule",
            root: true,
            args: [],
        },
    ],
});
