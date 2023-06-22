// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

import { ArrayLib } from "../src/lib/ArrayLib.sol";

contract PostDeploy is Script {
  using ArrayLib for string[];

  struct Location {
    string config;
    bytes32 id;
    string imgHash;
  }

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
    Location[] memory locations = abi.decode(vm.parseJson(json, ".locations2"), (Location[]));

    for (uint256 i=0; i<locations.length; i++) {
      bytes32 locationID = world.createLocation(
        locations[i].config,
        locations[i].imgHash,
        locations[i].id
      );
    }

    vm.stopBroadcast();
  }
}
