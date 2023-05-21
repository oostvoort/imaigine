// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import {
  LocationComponent,
  PathLocationComponent
} from "../src/codegen/Tables.sol";

contract TravelSystemTest is MudV2Test {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function test_PlayerTravelPath() public {

    // create available locations
    bytes32 location0 = world.createLocation("location0", "Location 0", "Image");
    bytes32 location1 = world.createLocation("location1", "Location 1", "Image");
    bytes32 location2 = world.createLocation("location1", "Location 2", "Image");
    bytes32 location3 = world.createLocation("location1", "Location 3", "Image");

    /*
    location0 -> location1 -> location2
                     v
        ^     <- location3
    */

    // connect locations via path
    bytes32 pathID_0_1 = world.createPath(location0, location1, "Location0-Location1 St", "Main Street");
    bytes32 pathID_1_2 = world.createPath(location1, location2, "Location1-Location2 St", "Main Street2");
    bytes32 pathID_1_3 = world.createPath(location1, location3, "Location1-Location3 St", "Main Street3");
    bytes32 pathID_0_3 = world.createPath(location0, location3, "Location0-Location3 St", "Main Street4");

    // player started on location0
    bytes32 playerID = world.createPlayer("Lyra", "human", "0xabc", location0);

    // go to location1
    bytes32 newLocationID = world.playerTravelPath(pathID_0_1);
    bytes32 playerLocationID = LocationComponent.get(world, playerID);
    assertEq(newLocationID, location1);
    assertEq(playerLocationID, location1);

    // go back to location0
    newLocationID = world.playerTravelPath(pathID_0_1);
    playerLocationID = LocationComponent.get(world, playerID);
    assertEq(newLocationID, location0);
    assertEq(playerLocationID, location0);

    // go to location3
    newLocationID = world.playerTravelPath(pathID_0_3);
    playerLocationID = LocationComponent.get(world, playerID);
    assertEq(newLocationID, location3);
    assertEq(playerLocationID, location3);

    // go to location1
    newLocationID = world.playerTravelPath(pathID_1_3);
    playerLocationID = LocationComponent.get(world, playerID);
    assertEq(newLocationID, location1);
    assertEq(playerLocationID, location1);

    // go to location2
    newLocationID = world.playerTravelPath(pathID_1_2);
    playerLocationID = LocationComponent.get(world, playerID);
    assertEq(newLocationID, location2);
    assertEq(playerLocationID, location2);
  }

  function test_revert_PlayerTravelPath() public {
    bytes32 location0 = world.createLocation("location0", "Location 0", "Image");

    vm.expectRevert(abi.encodePacked("to location does not exist"));
    world.playerTravelPath(location0);
  }
}