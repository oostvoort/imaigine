// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../../src/codegen/world/IWorld.sol";
import {
  PlanetComponent,
  NameComponent,
  RaceComponent,
  AttributeUintComponent
} from "../../src/codegen/Tables.sol";

contract PlayerTest is MudV2Test {
  using stdJson for string;

  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function test_NewPlanet() public {
    string memory json = vm.readFile("sample_world.json");
    string memory name = vm.parseJsonString(json, ".name");
    string memory theme = vm.parseJsonString(json, ".theme");
    string memory description = vm.parseJsonString(json, ".description");

    world.createPlanet(name, theme, description);
  }

//  function test_NewLocations() public {
//    string memory json = vm.readFile("sample_world.json");
//    bytes memory raw = json.parseRaw(string(abi.encodePacked(".locations.0")));
//    string memory location = abi.decode(raw, (Location));
//
//    world.setLocation();
//  }

  function test_NewPlayer() public {
    string memory json = vm.readFile("sample_world.json");

    // Player name, race
    string memory name = vm.parseJsonString(json, ".locations.[0].characters.[0].name");
//    string memory race = vm.parseJsonString(json, ".locations.[0].characters.[0].race");
    string memory race = "human";

    bytes32 playerID = world.createPlayer(name, race);

    string memory playerName = NameComponent.get(world, playerID);
    string memory playerRace = RaceComponent.get(world, playerID);

    assertEq(name, playerName);
    assertEq(race, playerRace);

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

    for(uint256 i=0; i<attrNames.length; i++) {
      bytes32 attrName = keccak256(abi.encodePacked(attrNames[i]));
      uint256 attrValue = AttributeUintComponent.get(world, playerID, attrName);

      assertEq(attrValue, attrValues[i]);
    }
  }
}
