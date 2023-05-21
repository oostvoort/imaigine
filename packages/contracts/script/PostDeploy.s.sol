// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

contract PostDeploy is Script {
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

    bytes32 locationID = world.createLocation(
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].name"))),
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].summary"))),
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].imgHash")))
    );

    // Player's

    world.createPlayer(
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[0].name"))),
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[0].summary"))),
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[0].imgHash"))),
      locationID
    );

    // NPC's

    world.createCharacter(
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[1].name"))),
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[1].summary"))),
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[1].imgHash"))),
      locationID
    );

    world.createCharacter(
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[2].name"))),
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[2].summary"))),
      vm.parseJsonString(json, string(abi.encodePacked(".locations.[0].characters.[2].imgHash"))),
      locationID
    );

    vm.stopBroadcast();
  }
}
