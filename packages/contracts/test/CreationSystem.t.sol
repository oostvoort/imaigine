// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  PlanetComponent,
  PlanetComponentData,
  StoryComponent,
  StoryComponentData,
  NameComponent,
  SummaryComponent,
  DescriptionComponent
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

  function testFuzz_CreateStory(
    string memory name,
    string memory summary,
    string memory theme,
    string[] memory races,
    string memory currency
  ) public {
    vm.assume(bytes(name).length > 0);
    vm.assume(bytes(summary).length > 0);
    vm.assume(bytes(theme).length > 0);
    vm.assume(races.length > 0);
    vm.assume(bytes(currency).length > 0);

    for (uint256 i=0; i<races.length; i++) {
      vm.assume(bytes(races[i]).length > 0);
    }

    bytes32 storyID = world.createStory(
      name,
      summary,
      theme,
      races,
      currency
    );

    StoryComponentData memory story = StoryComponent.get(world, storyID);

    assertTrue(storyID != story.themeID, "testFuzz_CreateStory::1");

    assertEq(NameComponent.get(world, storyID), name, "testFuzz_CreateStory::2");
    assertEq(SummaryComponent.get(world, storyID), summary, "testFuzz_CreateStory::3");
    assertEq(NameComponent.get(world, story.themeID), theme, "testFuzz_CreateStory::4");
    assertEq(NameComponent.get(world, story.currencyID), currency, "testFuzz_CreateStory::5");

    // TODO: verify races
  }

  function testFuzz_CreatePlanet(
    string memory name,
    string memory theme,
    string memory description
  ) public {
    vm.assume(bytes(name).length > 0);
    vm.assume(bytes(theme).length > 0);
    vm.assume(bytes(description).length > 0);

    world.createPlanet(name, theme, description);

    PlanetComponentData memory planet = PlanetComponent.get(world);

    assertEq(name, planet.name);
    assertEq(theme, planet.theme);
  }

  function test_revert_CreatePlanet() public {
    vm.expectRevert(abi.encodePacked("invalid name length"));
    world.createPlanet("", "theme", "description");

    vm.expectRevert(abi.encodePacked("invalid theme length"));
    world.createPlanet("name", "", "description");

    vm.expectRevert(abi.encodePacked("invalid description length"));
    world.createPlanet("name", "theme", "");
  }

  function testFuzz_CreatePlayer(
    string memory name,
    string memory description
  ) public {
    vm.assume(bytes(name).length > 0);
    vm.assume(bytes(description).length > 0);

    bytes32 playerID = world.createPlayer(name, description);

    string memory playerName = NameComponent.get(world, playerID);
    string memory playerDescription = DescriptionComponent.get(world, playerID);

    assertEq(name, playerName);
    assertEq(description, playerDescription);
  }

  function test_revert_CreatePlayerAlreadyExist() public {
    bytes32 playerID = world.createPlayer("name", "race");

    vm.expectRevert(abi.encodePacked("player already exist"));
    world.createPlayer("name", "race");
  }

  function test_revert_CreatePlayer() public {
    vm.expectRevert(abi.encodePacked("invalid name length"));
    world.createPlayer("", "race");

    vm.expectRevert(abi.encodePacked("invalid description length"));
    world.createPlayer("name", "");
  }
}