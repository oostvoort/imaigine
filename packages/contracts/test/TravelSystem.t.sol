// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import {
  TravelComponent,
  TravelComponentData,
  MapCellComponent,
  RevealedCellsComponent
} from "../src/codegen/Tables.sol";

import {
  TravelStatus
} from "../src/codegen/Types.sol";

import { ArrayLib } from "../src/lib/ArrayLib.sol";
import { BitMapLib } from "../src/lib/BitMapLib.sol";

contract InteractionSystem is MudV2Test {
  using ArrayLib for bytes;
  using ArrayLib for uint256[];
  using BitMapLib for uint256;

  IWorld public world;

  bytes32 private fromLocation;
  bytes32 private toLocation;
  bytes32 private playerId;
  uint256 private toLocationCellNumber = 100;
  bytes32 private zeroBytes = keccak256(abi.encodePacked(new bytes(0)));
  address private constant PLAYER_1 = address(1);

  uint256 private constant TRAVEL_SPEED = 1_000 * 15;

  function setUp() public override {
    vm.deal(PLAYER_1, 1000000);

    super.setUp();
    world = IWorld(worldAddress);

    fromLocation = world.createLocation("config", "image", 99);
    toLocation = keccak256(abi.encodePacked(bytes16("LOCATION"), toLocationCellNumber));

    vm.prank(PLAYER_1, PLAYER_1);
    playerId = world.createPlayer(bytes32(uint256(uint160(PLAYER_1))), "config", "image", fromLocation);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function test_prepareTravel() public {
    vm.prank(PLAYER_1, PLAYER_1);
    bytes32 locationId = world.prepareTravel(toLocationCellNumber);
    TravelComponentData memory travelComponentData = TravelComponent.get(world, playerId);
    assertEq(locationId, toLocation);
    assertTrue(TravelStatus.PREPARING == travelComponentData.status);
    assertEq(toLocationCellNumber, travelComponentData.destination);
    assertEq(0, travelComponentData.lastTravelledTimestamp);
    assertEq(zeroBytes, keccak256(abi.encodePacked(travelComponentData.path)));
    assertEq(zeroBytes, keccak256(abi.encodePacked(travelComponentData.toRevealAtDestination)));
  }

  function test_revert_startTravel() public {
    vm.expectRevert("must have path");
    world.startTravel(playerId, new uint256[](0), new uint256[](0));
    vm.expectRevert("player is not preparing to travel");
    world.startTravel(playerId, new uint256[](1), new uint256[](0));
  }

  function test_startTravel() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.prepareTravel(toLocationCellNumber);

    uint256[] memory pathCells = new uint256[](2);
    pathCells[0] = 1;
    pathCells[1] = 2;

    uint256[] memory toRevealAtDestination = new uint256[](2);
    toRevealAtDestination[0] = 3;
    toRevealAtDestination[1] = 4;

    uint256 timestamp = block.timestamp;
    world.startTravel(playerId, pathCells, toRevealAtDestination);

    TravelComponentData memory travelComponentData = TravelComponent.get(world, playerId);

    assertTrue(travelComponentData.status == TravelStatus.READY_TO_TRAVEL);
    assertEq(travelComponentData.destination, toLocationCellNumber);
    assertEq(travelComponentData.lastTravelledTimestamp, timestamp);
    assertEq(travelComponentData.path, pathCells.encode());
    assertEq(travelComponentData.toRevealAtDestination, toRevealAtDestination.encode());
  }

  function test_revert_travel() public {
    vm.expectRevert("player cannot travel yet");
    world.travel();

    vm.prank(PLAYER_1, PLAYER_1);
    world.prepareTravel(toLocationCellNumber);

    uint256[] memory pathCells = new uint256[](2);
    pathCells[0] = 1;
    pathCells[1] = 2;

    uint256[] memory toRevealAtDestination = new uint256[](2);
    toRevealAtDestination[0] = 3;
    toRevealAtDestination[1] = 4;

    uint256 timestamp = block.timestamp;
    world.startTravel(playerId, pathCells, toRevealAtDestination);

    uint256 newTimestamp = block.timestamp + TRAVEL_SPEED;
    vm.warp(newTimestamp);
    vm.prank(PLAYER_1, PLAYER_1);
    world.travel();

    newTimestamp += TRAVEL_SPEED;
    vm.warp(newTimestamp);
    vm.expectRevert("location is not ready for visiting");
    vm.prank(PLAYER_1, PLAYER_1);
    world.travel();
  }

  function test_travel() public {
    world.createLocation("config", "image", toLocationCellNumber);
    vm.prank(PLAYER_1, PLAYER_1);
    world.prepareTravel(toLocationCellNumber);

    uint256[] memory pathCells = new uint256[](2);
    pathCells[0] = 1;
    pathCells[1] = 2;

    uint256[] memory toRevealAtDestination = new uint256[](2);
    toRevealAtDestination[0] = 3;
    toRevealAtDestination[1] = 4;

    uint256 timestamp = block.timestamp;
    world.startTravel(playerId, pathCells, toRevealAtDestination);


    uint256 newTimestamp = block.timestamp + TRAVEL_SPEED;
    vm.warp(newTimestamp);
    vm.prank(PLAYER_1, PLAYER_1);
    world.travel();

    uint256[] memory newPathCells = new uint256[](1);
    newPathCells[0] = 2;

    TravelComponentData memory travelComponentData = TravelComponent.get(world, playerId);
    uint256 mapCell = MapCellComponent.get(world, playerId);


    assertTrue(travelComponentData.status == TravelStatus.TRAVELLING);
    assertEq(travelComponentData.destination, toLocationCellNumber);
    assertEq(travelComponentData.lastTravelledTimestamp, newTimestamp);
    assertEq(travelComponentData.path, newPathCells.encode());
    assertEq(travelComponentData.toRevealAtDestination, toRevealAtDestination.encode());
    assertEq(pathCells[0], mapCell);

    newTimestamp += TRAVEL_SPEED;
    vm.warp(newTimestamp);
    vm.prank(PLAYER_1, PLAYER_1);
    world.travel();

    travelComponentData = TravelComponent.get(world, playerId);

    assertTrue(travelComponentData.status == TravelStatus.NOT_TRAVELLING);
    assertEq(0, travelComponentData.destination);
    assertEq(travelComponentData.lastTravelledTimestamp, 0);
    assertEq(zeroBytes, keccak256(abi.encodePacked(travelComponentData.path)));
    assertEq(zeroBytes, keccak256(abi.encodePacked(travelComponentData.toRevealAtDestination)));

    uint256 revealedCells = 0;

    for(uint256 i = 0; i < toRevealAtDestination.length; i++) {
      revealedCells.setRevealedCell(toRevealAtDestination[i], true);
    }

    assertEq(RevealedCellsComponent.get(world, playerId), revealedCells);
  }
}
