// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  InteractComponent,
  InteractComponentData,
  ActionsComponent,
  ActionsComponentData,
  PossibleComponent,
  PossibleComponentData,
  AttributeIntComponent
} from "../src/codegen/Tables.sol";

import { StringLib } from "../src/lib/StringLib.sol";
import { ArrayLib } from "../src/lib/ArrayLib.sol";
import { Types } from "../src/types.sol";

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

    vm.label(worldAddress, "World");

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

  function getActions() internal returns (Types.ActionData[] memory){
    Types.ActionData[] memory actions = new Types.ActionData[](3);

    actions[0] = Types.ActionData(
      "action",
      "DEV_Option_0",
      10
    );
    actions[1] = Types.ActionData(
      "action",
      "DEV_Option_1",
      -10
    );
    actions[2] = Types.ActionData(
      "action",
      "DEV_Option_2",
      10
    );

    return actions;
  }

  function test_SaveInteraction() public {
    world.enterInteraction(mockNpcID_0);

    // DEV begin Interaction
    bytes32[] memory participants = new bytes32[](1);
    bytes[] memory participantsActions = new bytes[](participants.length);
    Types.ActionData[] memory actions = getActions();
    uint256[] memory actionsLengths = new uint256[](1);
    actionsLengths[0] = 3;

    participants[0] = mockPlayerID_DEV;
    participantsActions[0] = abi.encode(actions);

    // Initial interaction
    world.saveInteraction(mockNpcID_0, type(uint256).max, "log", participants, actionsLengths, participantsActions);

    PossibleComponentData memory dev_possibles = PossibleComponent.get(world, mockPlayerID_DEV, mockNpcID_0);
    assertGt(dev_possibles.createdAt, 0, "test_SaveInteraction::1");

    Types.ActionData[] memory cached_actions = abi.decode(dev_possibles.actions, (Types.ActionData[]));
    assertEq(cached_actions.length, 3, "test_SaveInteraction::2");
    assertEq(abi.encode(cached_actions[0]), abi.encode(actions[0]), "test_SaveInteraction::3");
    assertEq(abi.encode(cached_actions[1]), abi.encode(actions[1]), "test_SaveInteraction::4");
    assertEq(abi.encode(cached_actions[2]), abi.encode(actions[2]), "test_SaveInteraction::5");

    // ALICE Begin Interaction
    vm.prank(ALICE, ALICE);
    world.enterInteraction(mockNpcID_0);

    dev_possibles = PossibleComponent.get(world, mockPlayerID_ALICE, mockNpcID_0);
    assertEq(dev_possibles.createdAt, 0, "test_SaveInteraction::6");

    participants = new bytes32[](2);
    participantsActions = new bytes[](participants.length);
    actionsLengths = new uint256[](2);

    participants[0] = mockPlayerID_DEV;
    participantsActions[0] = abi.encode(actions);

    participants[1] = mockPlayerID_ALICE;
    participantsActions[1] = abi.encode(actions);

    actionsLengths[0] = 3;
    actionsLengths[1] = 3;

    world.saveInteraction(mockNpcID_0, 0, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 0, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 0, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 0, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 0, "log", participants, actionsLengths, participantsActions);

    int256 points = AttributeIntComponent.get(world, mockPlayerID_DEV, bytes32(abi.encode("karma")));

    console.logInt(points);

    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);
    world.saveInteraction(mockNpcID_0, 1, "log", participants, actionsLengths, participantsActions);

    points = AttributeIntComponent.get(world, mockPlayerID_DEV, bytes32(abi.encode("karma")));

    console.logInt(points);
  }

  function testFuzz_LeaveInteraction() public {
//    world.enterInteraction(mockNpcID_0);
//
//    // DEV begin Interaction
//    bytes32[] memory participants = new bytes32[](1);
//    string[][] memory participantsActions = new string[][](participants.length);
//    string[] memory actions = new string[](3);
//
//    participants[0] = mockPlayerID_DEV;
//
//    actions[0] = "DEV_Option_0";
//    actions[1] = "DEV_Option_1";
//    actions[2] = "DEV_Option_2";
//    participantsActions[0] = Types.ActionData(
//      "dialog",
//      ""
//    );
//
//    world.saveInteraction(mockNpcID_0, mockNpcID_0, "log", participants, participantsActions);
//
//    // ALICE Begin Interaction
//    vm.prank(ALICE, ALICE);
//    world.enterInteraction(mockNpcID_0);
//
//    world.leaveInteraction(mockNpcID_0, mockPlayerID_DEV);
//
//    ActionsComponentData memory dev_actionData = ActionsComponent.get(world, mockPlayerID_DEV, mockNpcID_0);
//    assertEq(dev_actionData.createdAt, 0, "test_LeaveInteraction::1");
//
//    string[] memory cached_actions = dev_actionData.actions.decodeStringArray();
//    assertEq(cached_actions.length, 0, "test_LeaveInteraction::2");
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
