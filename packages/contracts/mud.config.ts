import {mudConfig} from "@latticexyz/world/register";

export default mudConfig({
    systems: {
    },
    enums: {
      VotingStatusType: ["NOT_ACCEPTING_VOTES", "OPEN", "CLOSED"]
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
        CounterpartComponent: "bytes32",
        VotingComponent: {
          schema: {
            votingStatus: "VotingStatusType",
            voters: "bytes", // all voter player ids go here
            voteChoices: "bytes" // all their choices go in here
          }
        }
    },
    modules: [
        {
            name: "UniqueEntityModule",
            root: true,
            args: [],
        },
    ],
});
