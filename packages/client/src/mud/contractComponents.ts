/* Autogenerated file. Do not edit manually. */

import { TableId } from "@latticexyz/utils";
import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    StoryComponent: (() => {
      const tableId = new TableId("", "StoryComponent");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    ConfigComponent: (() => {
      const tableId = new TableId("", "ConfigComponent");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    ItemComponent: (() => {
      const tableId = new TableId("", "ItemComponent");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    OwnerComponent: (() => {
      const tableId = new TableId("", "OwnerComponent");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    AliveComponent: (() => {
      const tableId = new TableId("", "AliveComponent");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    NameComponent: (() => {
      const tableId = new TableId("", "NameComponent");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    SummaryComponent: (() => {
      const tableId = new TableId("", "SummaryComponent");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    ImageComponent: (() => {
      const tableId = new TableId("", "ImageComponent");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    PriceComponent: (() => {
      const tableId = new TableId("", "PriceComponent");
      return defineComponent(
        world,
        {
          value: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    CharacterComponent: (() => {
      const tableId = new TableId("", "CharacterCompone");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    TangibleComponent: (() => {
      const tableId = new TableId("", "TangibleComponen");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    CountComponent: (() => {
      const tableId = new TableId("", "CountComponent");
      return defineComponent(
        world,
        {
          value: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    PlayerComponent: (() => {
      const tableId = new TableId("", "PlayerComponent");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    LocationComponent: (() => {
      const tableId = new TableId("", "LocationComponen");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    MapCellComponent: (() => {
      const tableId = new TableId("", "MapCellComponent");
      return defineComponent(
        world,
        {
          value: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    SceneComponent: (() => {
      const tableId = new TableId("", "SceneComponent");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    KarmaPointsComponent: (() => {
      const tableId = new TableId("", "KarmaPointsCompo");
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    InteractableComponent: (() => {
      const tableId = new TableId("", "InteractableComp");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    InteractionTypeComponent: (() => {
      const tableId = new TableId("", "InteractionTypeC");
      return defineComponent(
        world,
        {
          value: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    RevealedCells: (() => {
      const tableId = new TableId("", "RevealedCells");
      return defineComponent(
        world,
        {
          value: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    SingleInteractionComponent: (() => {
      const tableId = new TableId("", "SingleInteractio");
      return defineComponent(
        world,
        {
          available: RecsType.Boolean,
          choice: RecsType.BigInt,
          processingTimeout: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    MultiInteractionComponent: (() => {
      const tableId = new TableId("", "MultiInteraction");
      return defineComponent(
        world,
        {
          available: RecsType.Boolean,
          playerCount: RecsType.BigInt,
          processingTimeout: RecsType.BigInt,
          players: RecsType.String,
          choices: RecsType.String,
          timeouts: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    TravelComponent: (() => {
      const tableId = new TableId("", "TravelComponent");
      return defineComponent(
        world,
        {
          status: RecsType.Number,
          destination: RecsType.BigInt,
          lastTravelledTimestamp: RecsType.BigInt,
          path: RecsType.String,
          toRevealAtDestination: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    BattleQueueComponent: (() => {
      const tableId = new TableId("", "BattleQueueCompo");
      return defineComponent(
        world,
        {
          playerId: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    BattleComponent: (() => {
      const tableId = new TableId("", "BattleComponent");
      return defineComponent(
        world,
        {
          opponent: RecsType.String,
          option: RecsType.String,
          status: RecsType.Number,
          hashSalt: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    BattleHistoryComponent: (() => {
      const tableId = new TableId("", "BattleHistoryCom");
      return defineComponent(
        world,
        {
          winner: RecsType.String,
          winnerOption: RecsType.Number,
          loser: RecsType.String,
          loserOption: RecsType.Number,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    BattleHistoryCounter: (() => {
      const tableId = new TableId("", "BattleHistoryCou");
      return defineComponent(
        world,
        {
          value: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
  };
}
