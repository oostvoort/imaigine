// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import {
  TravelComponent,
  TravelComponentData
} from "../src/codegen/Tables.sol";

import {
  InteractionType
} from "../src/codegen/Types.sol";

import { ArrayLib } from "../src/lib/ArrayLib.sol";

contract InteractionSystem is MudV2Test {
  using ArrayLib for bytes32[];
  IWorld public world;

  bytes32 fromLocation;
  bytes32 toLocation;
  bytes32 playerId;
  uint256 toLocationCellNumber = 100;

  function setUp() public override {
    vm.deal(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 1000000);

    super.setUp();
    world = IWorld(worldAddress);

    fromLocation = world.createLocation("config", "image", 99);
    toLocation = world.createLocation("config", "image", toLocationCellNumber);

    vm.prank(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683);
    playerId = world.createPlayer(bytes32(uint256(uint160(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683))), "config", "image", fromLocation);
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
    vm.prank(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683);
    bytes32 locationId = world.prepareTravel(toLocationCellNumber);
    TravelComponentData memory travelComponentData =


    assertEq(locationId, toLocation);
  }

  function test_interactSingle() public {
    uint256 choice = 0;

    vm.prank(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683);
    world.interactSingle(fromLocation, choice);
    SingleInteractionComponentData memory singleInteractionComponentData = SingleInteractionComponent.get(world, playerId, fromLocation);
    assertTrue(singleInteractionComponentData.available);
    assertEq(singleInteractionComponentData.choice, choice);
  }

  function test_interactSingle_withChoice() public {
    world.interactSingle(fromLocation, 0);
    world.interactSingle(fromLocation, 1);
  }

  function test_EnterMultiInteraction() public {
    uint256 choice = 0;
    vm.prank(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683);
    world.interactMulti(mockNPCID, choice);
    MultiInteractionComponentData memory multiInteraction = MultiInteractionComponent.get(world, mockNPCID);

    bytes32[] memory players = new bytes32[](0);
    bytes32[] memory newPlayers = players.push(playerId);

    assertEq(multiInteraction.players, newPlayers.encode());
  }
}
