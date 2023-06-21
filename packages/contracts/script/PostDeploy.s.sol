// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

import { ArrayLib } from "../src/lib/ArrayLib.sol";

contract PostDeploy is Script {
  using ArrayLib for string[];

  struct Location {
    bytes32 id;
    string imgHash;
    string name;
    string summary;
  }

  struct Path {
    string fromLocation;
    string name;
    string summary;
    string toLocation;
  }

  struct Player {
    string imgHash;
    string location;
    string name;
    string summary;
  }

  struct Character {
    string imgHash;
    string initialMessage;
    string location;
    string name;
    string summary;
  }

  mapping(string => bytes32) mapKeys;

  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // ------------------ EXAMPLES ------------------

    // Call increment on the world via the registered function selector
//    uint32 newValue = IWorld(worldAddress).increment();
//    console.log("Increment via IWorld:", newValue);

    IWorld world = IWorld(worldAddress);

    string memory json = vm.readFile("sample_world.json");

    string memory storyName = vm.parseJsonString(json, ".name");
    string memory storySummary = vm.parseJsonString(json, ".summary");
    string memory storyTheme = vm.parseJsonString(json, ".theme");
    string[] memory storyRaces = vm.parseJsonStringArray(json, ".races");
    string memory storyCurrency = vm.parseJsonString(json, ".currency");
    world.createStory(storyName, storySummary, storyTheme, storyRaces, storyCurrency);

    // Locations
    Location[] memory locations = abi.decode(vm.parseJson(json, ".locations2"), (Location[]));

    for (uint256 i=0; i<locations.length; i++) {
      bytes32 locationID = world.createLocation(
        locations[i].name,
        locations[i].summary,
        locations[i].imgHash,
        locations[i].id
      );

      mapKeys[locations[i].name] = locationID;
    }

    // Path's
    Path[] memory paths = abi.decode(vm.parseJson(json, ".paths"), (Path[]));

    for (uint256 i=0; i<paths.length; i++) {
      bytes32 location0 = mapKeys[paths[i].fromLocation];
      bytes32 location1 = mapKeys[paths[i].toLocation];

      bytes32 pathID = world.createPath(
        location0,
        location1,
        paths[i].name,
        paths[i].summary
      );

      mapKeys[paths[i].name] = pathID ;
    }

    // Player's
    Player[] memory players = abi.decode(vm.parseJson(json, ".players"), (Player[]));

    for (uint256 i=0; i<players.length; i++) {
      bytes32 location = mapKeys[players[i].location];

      uint256 privateKey = uint256(keccak256(abi.encodePacked(players[i].name)));
      address playerAddress = vm.addr(privateKey);

      if (i > 0) {
        vm.prank(playerAddress, playerAddress);
      }
      bytes32 playerID = world.createPlayer(
        players[i].name,
        players[i].summary,
        players[i].imgHash,
        location
      );

      mapKeys[players[i].name] = playerID;
    }

    // NPC's
    Character[] memory characters = abi.decode(vm.parseJson(json, ".characters"), (Character[]));

    for (uint256 i=0; i<characters.length; i++) {
      bytes32 location = mapKeys[characters[i].location];

      bytes32 characterID = world.createCharacter(
        characters[i].name,
        characters[i].summary,
        characters[i].imgHash,
        location,
        characters[i].initialMessage,
        new string[](0)
      );

      mapKeys[characters[i].name] = characterID;
    }

    vm.stopBroadcast();
  }
}
