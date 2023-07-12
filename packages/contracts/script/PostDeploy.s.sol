// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

import { ArrayLib } from "../src/lib/ArrayLib.sol";

contract PostDeploy is Script {
  using ArrayLib for string[];

  struct NPC {
    string imageHash;
    string ipfsHash;
    uint256 locationId;
  }

  struct Location {
    string config;
    uint256 id;
    string imgHash;
  }

  mapping(uint256 => bytes32) cellNumber;

  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // ------------------ EXAMPLES ------------------

    IWorld world = IWorld(worldAddress);

    string memory json = vm.readFile("sample_world.json");

    string memory storyConfig = vm.parseJsonString(json, ".storyConfig");
    world.createStory(storyConfig);

    // Locations
    Location[] memory locations = abi.decode(vm.parseJson(json, ".locations"), (Location[]));

    for (uint256 i=0; i<locations.length; i++) {
      bytes32 locationID = world.createLocation(
        locations[i].config,
        locations[i].imgHash,
        locations[i].id
      );
      cellNumber[locations[i].id] = locationID;
    }

    NPC[] memory npcs = abi.decode(vm.parseJson(json, ".npcs"), (NPC[]));

    for (uint256 i = 0; i < npcs.length; i++) {
      bytes32 npcId = world.createCharacter(
        npcs[i].ipfsHash,
        npcs[i].imageHash,
        cellNumber[npcs[i].locationId]
      );

      // TODO: remove this after
      bytes32 playerId = world.createPlayer(
        bytes32(
          uint256(
            uint160(
              72 + i
            )
          )
        ),
        npcs[i].ipfsHash,
        npcs[i].imageHash,
        cellNumber[npcs[i].locationId],
        new uint256[](0)
      );
    }

    vm.stopBroadcast();
  }
}
