// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

import {
  ImageComponent,
  SceneComponent,
  InteractionTypeComponent,
  InteractableComponent,
  SingleInteractionComponent,
  SingleInteractionComponentData
} from "../src/codegen/Tables.sol";

import {
  InteractionType
} from "../src/codegen/Types.sol";

contract InteractionSystem is MudV2Test {
  IWorld public world;

  bytes32 mockLocationID;
  bytes32 mockNPCID;
  bytes32 playerId;

  function setUp() public override {
//    vm.startPrank(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683);
    vm.deal(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 1000000);

    super.setUp();
    world = IWorld(worldAddress);

    mockLocationID = world.createLocation("config", "image", 99);

    mockNPCID = world.createCharacter("config", "image", mockLocationID);

    console.log(msg.sender);
    console.logBytes32(bytes32(uint256(uint160(msg.sender))));

    vm.prank(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683);
    playerId = world.createPlayer(bytes32(uint256(uint160(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683))), "config", "image", mockLocationID);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function test_revert_interactSingle() public {
    vm.expectRevert("cannot single interact");
    world.interactSingle(mockNPCID, 1);
  }

  function test_interactSingle() public {
    uint256 choice = 0;

    console.logBytes32(playerId);
    console.log(msg.sender);

    vm.prank(0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683, 0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683);
    world.interactSingle(mockLocationID, choice);
    SingleInteractionComponentData memory singleInteractionComponentData = SingleInteractionComponent.get(world, playerId, mockLocationID);
    console.log(singleInteractionComponentData.processingTimeout);
    console.log(singleInteractionComponentData.available);
    assertTrue(singleInteractionComponentData.available);
    assertEq(singleInteractionComponentData.choice, choice);
  }

  function test_interactSingle_withChoice() public {
    world.interactSingle(mockLocationID, 0);
    world.interactSingle(mockLocationID, 1);
  }
}
