/* Autogenerated file. Do not edit manually. */

import { TableId } from "@latticexyz/utils";
import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    ControllerComponent: (() => {
      const tableId = new TableId("", "ControllerCompon");
      return defineComponent(
        world,
        {
          oracle: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    PlanetComponent: (() => {
      const tableId = new TableId("", "PlanetComponent");
      return defineComponent(
        world,
        {
          name: RecsType.String,
          theme: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    StoryComponent: (() => {
      const tableId = new TableId("", "StoryComponent");
      return defineComponent(
        world,
        {
          themeID: RecsType.String,
          racesID: RecsType.String,
          currencyID: RecsType.String,
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
    DescriptionComponent: (() => {
      const tableId = new TableId("", "DescriptionCompo");
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
    RaceComponent: (() => {
      const tableId = new TableId("", "RaceComponent");
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
    PathComponent: (() => {
      const tableId = new TableId("", "PathComponent");
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
    PathLocationComponent: (() => {
      const tableId = new TableId("", "PathLocationComp");
      return defineComponent(
        world,
        {
          location0: RecsType.String,
          location1: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    InteractComponent: (() => {
      const tableId = new TableId("", "InteractComponen");
      return defineComponent(
        world,
        {
          initialMsg: RecsType.String,
          initialActions: RecsType.String,
          participants: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    InteractionComponent: (() => {
      const tableId = new TableId("", "InteractionCompo");
      return defineComponent(
        world,
        {
          waitingFor: RecsType.String,
          lastInteraction: RecsType.BigInt,
          participantsActions: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    LogComponent: (() => {
      const tableId = new TableId("", "LogComponent");
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
    ActionsComponent: (() => {
      const tableId = new TableId("", "ActionsComponent");
      return defineComponent(
        world,
        {
          createdAt: RecsType.BigInt,
          actions: RecsType.String,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    AttributeUintComponent: (() => {
      const tableId = new TableId("", "AttributeUintCom");
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
    AttributeStringComponent: (() => {
      const tableId = new TableId("", "AttributeStringC");
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
    StoryActionComponent: (() => {
      const tableId = new TableId("", "StoryActionCompo");
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
  };
}
