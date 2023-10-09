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
  SingleInteractionComponentData,
  MultiInteractionComponent,
  MultiInteractionComponentData
} from "../src/codegen/Tables.sol";

import {
  InteractionType
} from "../src/codegen/Types.sol";

import { ArrayLib } from "../src/lib/ArrayLib.sol";

contract InteractionSystem is MudV2Test {
  using ArrayLib for bytes32[];
  IWorld public world;

  bytes32 private mockLocationID;
  bytes32 private mockNPCID;
  bytes32 private player1Id;
  bytes32 private player2Id;
  address private constant PLAYER_1 = address(1);
  address private constant PLAYER_2 = address(2);

  function setUp() public override {
    vm.deal(PLAYER_1, 1000000);
    vm.deal(PLAYER_2, 1000000);

    super.setUp();
    world = IWorld(worldAddress);

    mockLocationID = world.createLocation("config", "image", 99);
    mockNPCID = world.createCharacter("config", "image", mockLocationID);
    player1Id = world.createPlayer(bytes32(uint256(uint160(PLAYER_1))), "config", "image", mockLocationID, new uint256[](0));
    player2Id = world.createPlayer(bytes32(uint256(uint160(PLAYER_2))), "config", "image", mockLocationID, new uint256[](0));
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

    vm.prank(PLAYER_1, PLAYER_1);
    world.interactSingle(mockLocationID, choice);
    SingleInteractionComponentData memory singleInteractionComponentData = SingleInteractionComponent.get(world, player1Id, mockLocationID);
    assertTrue(singleInteractionComponentData.available);
    assertEq(singleInteractionComponentData.choice, choice);
  }

  function test_interactSingle_withChoice() public {
    world.interactSingle(mockLocationID, 0);
    world.interactSingle(mockLocationID, 1);
  }

  function test_EnterMultiInteraction() public {
    uint256 enterChoice = 0;
    uint256 round1Choice = 3;

    vm.prank(PLAYER_1, PLAYER_1);
    world.interactMulti(mockNPCID, enterChoice);
    MultiInteractionComponentData memory multiInteraction = MultiInteractionComponent.get(world, mockNPCID);

    bytes32[] memory players = new bytes32[](0);
    bytes32[] memory newPlayers = players.push(player1Id);

    assertEq(multiInteraction.players, newPlayers.encode());

    vm.prank(PLAYER_2, PLAYER_2);
    world.interactMulti(mockNPCID, enterChoice);

    multiInteraction = MultiInteractionComponent.get(world, mockNPCID);
    newPlayers = newPlayers.push(player2Id);

    assertEq(multiInteraction.players, newPlayers.encode());

    vm.prank(PLAYER_1, PLAYER_1);
    world.interactMulti(mockNPCID, round1Choice);
    vm.prank(PLAYER_2, PLAYER_2);
    world.interactMulti(mockNPCID, round1Choice);
    assertEq(world.winningChoice(mockNPCID), round1Choice);
  }

  function test_reinteraction() public {
    uint256 enterChoice = 0;

    vm.prank(PLAYER_1, PLAYER_1);
    world.interactMulti(mockNPCID, enterChoice);

    vm.prank(PLAYER_1, PLAYER_1);
    world.interactSingle(mockLocationID, enterChoice);

    vm.prank(PLAYER_1, PLAYER_1);
    world.interactMulti(mockNPCID, enterChoice);
  }
}
