// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  PlanetComponent,
  PlanetComponentData,
  NameComponent,
  RaceComponent
} from "../src/codegen/Tables.sol";

import { Constants } from "../src/lib/Constants.sol";

contract CreationSystemTest is MudV2Test {
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

  function testFuzz_CreatePlanet(
    string memory name,
    string memory theme,
    string memory description
  ) public {
    vm.assume(keccak256(abi.encodePacked(name)) != Constants.EMPTY_HASH);
    vm.assume(keccak256(abi.encodePacked(theme)) != Constants.EMPTY_HASH);

    world.createPlanet(name, theme, description);

    PlanetComponentData memory planet = PlanetComponent.get(world);

    assertEq(name, planet.name);
    assertEq(theme, planet.theme);
  }

  function test_revert_CreatePlanet() public {
    vm.expectRevert(abi.encodePacked("invalid name"));
    world.createPlanet("", "theme", "description");

    vm.expectRevert(abi.encodePacked("invalid theme"));
    world.createPlanet("name", "", "description");

    vm.expectRevert(abi.encodePacked("invalid description"));
    world.createPlanet("name", "theme", "");
  }

  function testFuzz_CreatePlayer(
    string memory name,
    string memory race
  ) public {
    vm.assume(keccak256(abi.encodePacked(name)) != Constants.EMPTY_HASH);
    vm.assume(keccak256(abi.encodePacked(race)) != Constants.EMPTY_HASH);

    bytes32 playerID = world.createPlayer(name, race);

    string memory playerName = NameComponent.get(world, playerID);
    string memory playerRace = RaceComponent.get(world, playerID);

    assertEq(name, playerName);
    assertEq(race, playerRace);
  }

  function test_revert_CreatePlayer() public {
    vm.expectRevert(abi.encodePacked("invalid name"));
    world.createPlayer("", "race");

    vm.expectRevert(abi.encodePacked("invalid race"));
    world.createPlayer("name", "");
  }
}