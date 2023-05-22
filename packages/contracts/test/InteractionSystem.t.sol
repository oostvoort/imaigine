// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  InteractComponent,
  InteractComponentData,
  ActionsComponent,
  ActionsComponentData
} from "../src/codegen/Tables.sol";

import { StringLib } from "../src/lib/StringLib.sol";
import { ArrayLib } from "../src/lib/ArrayLib.sol";

contract InteractionSystemTest is MudV2Test {
  using StringLib for string;
  using ArrayLib for bytes;

  IWorld public world;

  address payable DEV;
  address payable ALICE;
  address payable BOB;

  bytes32 mockLocationID;

  bytes32 mockPlayerID_DEV;
  bytes32 mockPlayerID_ALICE;
  bytes32 mockPlayerID_BOB;

  bytes32 mockNpcID_0;
  bytes32 mockNpcID_1;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

     DEV = payable(address(this));
     ALICE = payable(address(makeAddr("alice")));
     BOB = payable(address(makeAddr("bob")));

    // location
    mockLocationID = world.createLocation("A", "B", "C");

    // players
    mockPlayerID_DEV = world.createPlayer("Dev", "A warrior", "456", mockLocationID);

    vm.prank(ALICE, ALICE);
    mockPlayerID_ALICE = world.createPlayer("Alice", "A mage", "ABC", mockLocationID);

    vm.prank(BOB, ALICE);
    mockPlayerID_BOB = world.createPlayer("Bob", "A knight", "DEF", mockLocationID);

    // npc
    string[] memory actions = new string[](3);
    actions[0] = "Option0";
    actions[1] = "Option1";
    actions[2] = "Option2";

    mockNpcID_0 = world.createCharacter("Shop Keeper", "Keeping the shop", "XYZ", mockLocationID, "Welcome to shop!", actions);
    mockNpcID_1 = world.createCharacter("Blacksmith", "Forging", "STW", mockLocationID, "What do you want?", actions);
  }

  function test_EnterInteraction() public {
    world.enterInteraction(mockNpcID_0);

    InteractComponentData memory npcInteractData = InteractComponent.get(world, mockNpcID_0);
    assertFalse(npcInteractData.initialMsg.isEmpty(), "test_EnterInteraction::1");
    assertEq(npcInteractData.participants.decodeBytes32Array().length, 1, "test_EnterInteraction::2");

    vm.prank(ALICE, ALICE);
    world.enterInteraction(mockNpcID_0);

    npcInteractData = InteractComponent.get(world, mockNpcID_0);
    assertFalse(npcInteractData.initialMsg.isEmpty(), "test_EnterInteraction::3");
    assertEq(npcInteractData.participants.decodeBytes32Array().length, 2, "test_EnterInteraction::4");

  }

  function test_SaveInteraction() public {
    world.enterInteraction(mockNpcID_0);

    // DEV begin Interaction
    bytes32[] memory participants = new bytes32[](1);
    string[][] memory participantsActions = new string[][](participants.length);
    string[] memory actions = new string[](3);

    participants[0] = mockPlayerID_DEV;

    actions[0] = "DEV_Option_0";
    actions[1] = "DEV_Option_1";
    actions[2] = "DEV_Option_2";
    participantsActions[0] = actions;

    world.saveInteraction(mockNpcID_0, mockNpcID_0, "log", participants, participantsActions);

    ActionsComponentData memory dev_actionData = ActionsComponent.get(world, mockPlayerID_DEV, mockNpcID_0);
    assertGt(dev_actionData.createdAt, 0, "test_SaveInteraction::1");

    string[] memory cached_actions = dev_actionData.actions.decodeStringArray();
    assertEq(cached_actions.length, 3, "test_SaveInteraction::2");
    assertEq(cached_actions[0], "DEV_Option_0", "test_SaveInteraction::3");
    assertEq(cached_actions[1], "DEV_Option_1", "test_SaveInteraction::4");
    assertEq(cached_actions[2], "DEV_Option_2", "test_SaveInteraction::5");

    // ALICE Begin Interaction
    vm.prank(ALICE, ALICE);
    world.enterInteraction(mockNpcID_0);

    dev_actionData = ActionsComponent.get(world, mockPlayerID_ALICE, mockNpcID_0);
    assertEq(dev_actionData.createdAt, 0, "test_SaveInteraction::6");

    cached_actions = dev_actionData.actions.decodeStringArray();
    assertEq(cached_actions.length, 0, "test_SaveInteraction::7");
  }

  function test_UpdateNpcInitialAction() public {
    string[] memory actions = new string[](3);

    actions[0] = "A_Option_0";
    actions[1] = "A_Option_1";
    actions[2] = "A_Option_2";

    world.setEntityInitialActions(mockNpcID_0, actions);

    string[] memory cached_actions = InteractComponent.getInitialActions(world, mockNpcID_0).decodeStringArray();

    assertEq(actions.length, cached_actions.length, "test_UpdateNpcInitialAction::1");
    assertEq(cached_actions[0], "A_Option_0", "test_SaveInteraction::2");
    assertEq(cached_actions[1], "A_Option_1", "test_SaveInteraction::3");
    assertEq(cached_actions[2], "A_Option_2", "test_SaveInteraction::4");
  }
}
