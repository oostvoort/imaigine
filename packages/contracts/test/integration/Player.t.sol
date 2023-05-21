// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../../src/codegen/world/IWorld.sol";
import {
  PlanetComponent,
  NameComponent,
  SummaryComponent,
  ImageComponent,
  DescriptionComponent,
  RaceComponent,
  AttributeUintComponent
} from "../../src/codegen/Tables.sol";

contract PlayerTest is MudV2Test {
  using stdJson for string;

  IWorld public world;

  bytes32 mockLocationID;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    mockLocationID = world.createLocation("A", "B", "C");
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

    // Player name, description
    string memory name = vm.parseJsonString(json, ".locations.[0].characters.[0].name");
    string memory summary = vm.parseJsonString(json, ".locations.[0].characters.[0].summary");
    string memory imgHash = vm.parseJsonString(json, ".locations.[0].characters.[0].imgHash");

    bytes32 playerID = world.createPlayer(name, summary, imgHash, mockLocationID);

    string memory playerName = NameComponent.get(world, playerID);
    string memory playerSummary = SummaryComponent.get(world, playerID);
    string memory playerImgHash = ImageComponent.get(world, playerID);

    assertEq(name, playerName);
    assertEq(summary, playerSummary);
    assertEq(imgHash, playerImgHash);
  }
}
