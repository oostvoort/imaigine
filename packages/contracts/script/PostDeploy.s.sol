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

    // Player name, race
    string memory name = vm.parseJsonString(json, ".locations.[0].characters.[0].name");
    //    string memory race = vm.parseJsonString(json, ".locations.[0].characters.[0].race");
    string memory race = "human";

    bytes32 playerID = world.createPlayer(name, race);

    // Attributes
    string[] memory attrNames = new string[](6);
    attrNames[0] = "strength";
    attrNames[1] = "dexterity";
    attrNames[2] = "constitution";
    attrNames[3] = "intelligence";
    attrNames[4] = "charisma";
    attrNames[5] = "wisdom";

    uint256[] memory attrValues = new uint256[](6);
    attrValues[0] = vm.parseJsonUint(json, ".locations.[0].characters.[0].stats.strength");
    attrValues[1] = vm.parseJsonUint(json, ".locations.[0].characters.[0].stats.dexterity");
    attrValues[2] = vm.parseJsonUint(json, ".locations.[0].characters.[0].stats.constitution");
    attrValues[3] = vm.parseJsonUint(json, ".locations.[0].characters.[0].stats.intelligence");
    attrValues[4] = vm.parseJsonUint(json, ".locations.[0].characters.[0].stats.charisma");
    attrValues[5] = vm.parseJsonUint(json, ".locations.[0].characters.[0].stats.wisdom");

    world.setAttributesUint(playerID, attrNames, attrValues);

    string memory location = vm.parseJsonString(json, ".locations.[0].name");
    world.setLocation(playerID, location);

    vm.stopBroadcast();
  }
}
