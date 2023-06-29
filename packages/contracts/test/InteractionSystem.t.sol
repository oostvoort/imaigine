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
    super.setUp();
    world = IWorld(worldAddress);

    mockLocationID = world.createLocation("config", "image", 99);
    console.logBytes32(mockLocationID);

    mockNPCID = world.createCharacter("config", "image", mockLocationID);
    console.logBytes32(mockNPCID);
    playerId = world.createPlayer("config", "image", mockLocationID);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function xtest_revert_interactSingle() public {
    vm.expectRevert("cannot single interact");
    world.interactSingle(mockNPCID, 1);
  }

  function test_interactSingle() public {
    uint256 choice = 0;

    world.interactSingle(mockLocationID, choice);
    SingleInteractionComponentData memory singleInteractionComponentData = SingleInteractionComponent.get(world, playerId, mockLocationID);
    assertTrue(singleInteractionComponentData.available);
    assertEq(singleInteractionComponentData.choice, choice);
  }

  function test_interactSingle_withChoice() public {
    world.interactSingle(mockLocationID, 0);
    world.interactSingle(mockLocationID, 1);
  }
}
