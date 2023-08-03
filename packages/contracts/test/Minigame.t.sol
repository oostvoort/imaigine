// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

import {
BattleQueueComponent,
BattleComponent,
BattleComponentData,
BattlePointsComponent,
BattleResultsComponents,
BattleResultsComponentsData,
BattleHistoryComponent,
BattleHistoryComponentData
} from "../src/codegen/Tables.sol";
import {

BattleStatus,
BattleOptions,
BattleOutcomeType
} from "../src/codegen/Types.sol";

contract MinigameTest is MudV2Test {
  IWorld public world;

  address private constant PLAYER_1 = address(1);
  address private constant PLAYER_2 = address(2);
  address private constant PLAYER_3 = address(3);

  // int -> uint -> bytes32
  bytes32 private constant LOCATION_ID = bytes32(uint256(1));

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    // address -> uint160 -> uint256 -> bytes32
    world.setUpPlayer(bytes32(uint256(uint160(PLAYER_1))), LOCATION_ID);
    world.setUpPlayer(bytes32(uint256(uint160(PLAYER_2))), LOCATION_ID);
    world.setUpPlayer(bytes32(uint256(uint160(PLAYER_3))), LOCATION_ID);
  }

  function test_play() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    bytes32 playerInQueue = BattleQueueComponent.get(world, LOCATION_ID);

    assertEq(playerInQueue, bytes32(uint256(uint160(PLAYER_1))), "test_play::1");

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    playerInQueue = BattleQueueComponent.get(world, LOCATION_ID);

    assertEq(playerInQueue, bytes32(uint256(0)), "test_play::2");
  }

  function test_onSelect() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    // PLAYER 1, select Scroll
    bytes32 player1_hash = keccak256(abi.encode(uint256(BattleOptions.Scroll), "123"));

    vm.prank(PLAYER_1, PLAYER_1);
    world.onSelect(player1_hash);

    BattleComponentData memory battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));

    assertEq(battleData.hashedOption, player1_hash, "test_onSelect::1");
    assertEq(uint256(battleData.status), uint256(BattleStatus.DONE_SELECTING), "test_onSelect::2");

    // PLAYER 2, select Potion
    bytes32 player2_hash = keccak256(abi.encode(uint256(BattleOptions.Potion), "123"));

    vm.prank(PLAYER_2, PLAYER_2);
    world.onSelect(player2_hash);

    battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(battleData.hashedOption, player2_hash, "test_onSelect::1");
    assertEq(uint256(battleData.status), uint256(BattleStatus.DONE_SELECTING), "test_onSelect::2");
  }

  function test_reveal() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, false);
    doSelect(PLAYER_2, BattleOptions.Sword, false);

    vm.warp(block.timestamp + 31); // warp to deadline

    // Players lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, true);
    doSelect(PLAYER_2, BattleOptions.Sword, true);

    BattleComponentData memory player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleComponentData memory player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    uint256 player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    uint256 player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    BattleResultsComponentsData memory player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleResultsComponentsData memory player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_reveal::1");
    assertEq(uint256(player1_battleData.outcome), uint256(BattleOutcomeType.LOSE), "test_reveal::1.1");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_reveal::2");
    assertEq(uint256(player2_battleData.outcome), uint256(BattleOutcomeType.WIN), "test_reveal::2.1");

    // Player 2 wins
    assertEq(player1_points, 0, "test_reveal::3");
    assertEq(player2_points, 1, "test_reveal::4");

    assertEq(player1_battleResult.totalWins, 0, "test_reveal::5");
    assertEq(player1_battleResult.totalLoses, 1, "test_reveal::6");
    assertEq(player2_battleResult.totalWins, 1, "test_reveal::7");
    assertEq(player2_battleResult.totalLoses, 0, "test_reveal::8");

    // Rematch
    vm.prank(PLAYER_1, PLAYER_1);
    world.rematch();

    vm.prank(PLAYER_2, PLAYER_2);
    world.rematch();

    player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.option), uint256(BattleOptions.NONE), "test_reveal::9");
    assertEq(uint256(player2_battleData.option), uint256(BattleOptions.NONE), "test_reveal::10");
    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_reveal::11");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_reveal::12");

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Potion, false);
    doSelect(PLAYER_2, BattleOptions.Sword, false);

    vm.warp(block.timestamp + 31); // warp to deadline

    // Players lock In
    doSelect(PLAYER_1, BattleOptions.Potion, true);
    doSelect(PLAYER_2, BattleOptions.Sword, true);

    player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(player1_points, 1, "test_reveal::13");
    assertEq(player2_points, 1, "test_reveal::14");

    assertEq(player1_battleResult.totalWins, 1, "test_reveal::15");
    assertEq(player1_battleResult.totalLoses, 1, "test_reveal::16");
    assertEq(player2_battleResult.totalWins, 1, "test_reveal::17");
    assertEq(player2_battleResult.totalLoses, 1, "test_reveal::18");

    // Rematch
    vm.prank(PLAYER_1, PLAYER_1);
    world.rematch();

    vm.prank(PLAYER_2, PLAYER_2);
    world.rematch();

    player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.option), uint256(BattleOptions.NONE), "test_reveal::19");
    assertEq(uint256(player2_battleData.option), uint256(BattleOptions.NONE), "test_reveal::20");
    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_reveal::21");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_reveal::22");

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Potion, false);
    doSelect(PLAYER_2, BattleOptions.Potion, false);

    vm.warp(block.timestamp + 31); // warp to deadline

    // Players lock In
    doSelect(PLAYER_1, BattleOptions.Potion, true);
    doSelect(PLAYER_2, BattleOptions.Potion, true);

    player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(player1_points, 1, "test_reveal::23");
    assertEq(player2_points, 1, "test_reveal::24");

    assertEq(player1_battleResult.totalWins, 1, "test_reveal::25");
    assertEq(player1_battleResult.totalLoses, 1, "test_reveal::26");
    assertEq(player2_battleResult.totalWins, 1, "test_reveal::27");
    assertEq(player2_battleResult.totalLoses, 1, "test_reveal::28");
  }

  function test_forfeit() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, false);
    vm.warp(block.timestamp + 31); // after deadline
    doSelect(PLAYER_1, BattleOptions.Scroll, true);

    BattleComponentData memory player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleComponentData memory player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_forfeit::1");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_forfeit::2");

    vm.warp(block.timestamp + 31); // 1min forfeitDeadline
    vm.roll(block.number + 1);
    vm.prank(PLAYER_1, PLAYER_1);
    world.validateBattle();

    player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));
    uint256 player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    uint256 player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));
    bytes32 playerInQueue = BattleQueueComponent.get(world, LOCATION_ID);

    BattleResultsComponentsData memory player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleResultsComponentsData memory player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(player1_points, 1, "test_forfeit::3");
    assertEq(player2_points, 0, "test_forfeit::4");

    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.NOT_IN_BATTLE), "test_forfeit::5");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.NOT_IN_BATTLE), "test_forfeit::6");

    assertEq(playerInQueue, bytes32(uint256(uint160(PLAYER_1))), "test_forfeit::7");

    // battle should be cleaned up
    assertEq(player1_battleResult.totalWins, 0, "test_forfeit::8");
    assertEq(player1_battleResult.totalLoses, 0, "test_forfeit::9");
    assertEq(player2_battleResult.totalWins, 0, "test_forfeit::10");
    assertEq(player2_battleResult.totalLoses, 0, "test_forfeit::11");
  }

  function test_leave() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.leave();


    bytes32 playerInQueue = BattleQueueComponent.get(world, LOCATION_ID);

    uint256 player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    uint256 player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(playerInQueue, bytes32(uint256(uint160(PLAYER_1))), "test_leave::1");

    assertEq(player1_points, 1, "test_leave::2");
    assertEq(player2_points, 0, "test_leave::3");
  }

  function test_leaveWithSomeoneInQueue() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    // PLAYER_1 and PLAYER_2
    BattleComponentData memory player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleComponentData memory player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_leaveWithSomeoneInQueue::1");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_leaveWithSomeoneInQueue::2");
    assertEq(player1_battleData.opponent, bytes32(uint256(uint160(PLAYER_2))), "test_leaveWithSomeoneInQueue::3");
    assertEq(player2_battleData.opponent, bytes32(uint256(uint160(PLAYER_1))), "test_leaveWithSomeoneInQueue::4");

    // PLAYER_3
    vm.prank(PLAYER_3, PLAYER_3);
    world.play();

    // PLAYER_3 must inside the quee
    bytes32 playerInQueue = BattleQueueComponent.get(world, LOCATION_ID);
    assertEq(playerInQueue, bytes32(uint256(uint160(PLAYER_3))), "test_leaveWithSomeoneInQueue::5");

    vm.prank(PLAYER_2, PLAYER_2);
    world.leave();

    // PLAYER_1 and Player_3 must in battle
    player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));
    BattleComponentData memory player3_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_3))));

    assertEq(player1_battleData.opponent, bytes32(uint256(uint160(PLAYER_3))), "test_leaveWithSomeoneInQueue::6");
    assertEq(player3_battleData.opponent, bytes32(uint256(uint160(PLAYER_1))), "test_leaveWithSomeoneInQueue::7");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.NOT_IN_BATTLE), "test_leaveWithSomeoneInQueue::8");
  }

  function test_battleLogs() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, false);
    doSelect(PLAYER_2, BattleOptions.Sword, false);

    vm.warp(block.timestamp + 31); // warp to deadline

    // Players lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, true);
    doSelect(PLAYER_2, BattleOptions.Sword, true);

    BattleComponentData memory player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleComponentData memory player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    uint256 player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    uint256 player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    BattleResultsComponentsData memory player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleResultsComponentsData memory player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_battleLogs::1");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_battleLogs::2");

    // Player 2 wins
    assertEq(player1_points, 0, "test_battleLogs::3");
    assertEq(player2_points, 1, "test_battleLogs::4");

    assertEq(player1_battleResult.totalWins, 0, "test_battleLogs::5");
    assertEq(player1_battleResult.totalLoses, 1, "test_battleLogs::6");
    assertEq(player2_battleResult.totalWins, 1, "test_battleLogs::7");
    assertEq(player2_battleResult.totalLoses, 0, "test_battleLogs::8");

    // GET PLAYER_1 Battle Logs
    BattleHistoryComponentData memory player_1_history = BattleHistoryComponent.get(world, 1);

    // GET PLAYER_2 Battle logs
    BattleHistoryComponentData memory player_2_history = BattleHistoryComponent.get(world, 1);

    // player1 and player2 check for winner and loser
    assertEq(player_1_history.winner, bytes32(uint256(uint160(PLAYER_2))), "test_battleLogs::9");
    assertEq(player_2_history.loser, bytes32(uint256(uint160(PLAYER_1))), "test_battleLogs::10");

    // player1 and player2 check must not draw
    assertEq(player_1_history.draw, false, "test_battleLogs::11");
    assertEq(player_2_history.draw, false, "test_battleLogs::12");

    // Rematch
    vm.prank(PLAYER_1, PLAYER_1);
    world.rematch();

    vm.prank(PLAYER_2, PLAYER_2);
    world.rematch();

    player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.option), uint256(BattleOptions.NONE), "test_battleLogs::13");
    assertEq(uint256(player2_battleData.option), uint256(BattleOptions.NONE), "test_battleLogs::14");
    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_battleLogs::15");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_battleLogs::16");

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Sword, false);
    doSelect(PLAYER_2, BattleOptions.Sword, false);

    vm.warp(block.timestamp + 31); // warp to deadline

    // Players lock In
    doSelect(PLAYER_1, BattleOptions.Sword, true);
    doSelect(PLAYER_2, BattleOptions.Sword, true);

    player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(player1_points, 0, "test_battleLogs::16");
    assertEq(player2_points, 1, "test_battleLogs::17");

    assertEq(player1_battleResult.totalWins, 0, "test_battleLogs::18");
    assertEq(player1_battleResult.totalLoses, 1, "test_battleLogs::19");
    assertEq(player2_battleResult.totalWins, 1, "test_battleLogs::20");
    assertEq(player2_battleResult.totalLoses, 0, "test_battleLogs::21");

    player_1_history = BattleHistoryComponent.get(world, 2);
    player_2_history = BattleHistoryComponent.get(world, 2);

    // player1 and player2 check for winner and loser
    assertEq(player_1_history.winner, bytes32(0), "test_battleLogs::22");
    assertEq(player_2_history.loser, bytes32(0), "test_battleLogs::23");

    // player1 and player2 check must draw
    assertEq(player_1_history.draw, true, "test_battleLogs::24");
    assertEq(player_2_history.draw, true, "test_battleLogs::25");
  }

  function test_battleOutcome() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, false);
    doSelect(PLAYER_2, BattleOptions.Sword, false);

    vm.warp(block.timestamp + 31); // warp to deadline

    // Players lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, true);
    doSelect(PLAYER_2, BattleOptions.Sword, true);

    BattleComponentData memory player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleComponentData memory player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    uint256 player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    uint256 player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    BattleResultsComponentsData memory player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleResultsComponentsData memory player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_battleOutcome::1");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_battleOutcome::2");

    // Player 2 wins
    assertEq(player1_points, 0, "test_battleOutcome::3");
    assertEq(player2_points, 1, "test_battleOutcome::4");

    assertEq(player1_battleResult.totalWins, 0, "test_battleOutcome::5");
    assertEq(player1_battleResult.totalLoses, 1, "test_battleOutcome::6");
    assertEq(player2_battleResult.totalWins, 1, "test_battleOutcome::7");
    assertEq(player2_battleResult.totalLoses, 0, "test_battleOutcome::8");

    // Expect Battle Outcome
    assertEq(uint256(player1_battleData.outcome), uint256(BattleOutcomeType.LOSE), "test_battleOutcome::9");
    assertEq(uint256(player2_battleData.outcome), uint256(BattleOutcomeType.WIN), "test_battleOutcome::10");

    // Rematch
    vm.prank(PLAYER_1, PLAYER_1);
    world.rematch();

    vm.prank(PLAYER_2, PLAYER_2);
    world.rematch();

    player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.option), uint256(BattleOptions.NONE), "test_battleLogs::11");
    assertEq(uint256(player2_battleData.option), uint256(BattleOptions.NONE), "test_battleLogs::12");
    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_battleLogs::13");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.IN_BATTLE), "test_battleLogs::14");
    assertEq(uint256(player1_battleData.outcome), uint256(BattleOutcomeType.NONE), "test_battleOutcome::15");
    assertEq(uint256(player2_battleData.outcome), uint256(BattleOutcomeType.NONE), "test_battleOutcome::16");

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Sword, false);
    doSelect(PLAYER_2, BattleOptions.Sword, false);

    vm.warp(block.timestamp + 31); // warp to deadline

    // Players lock In
    doSelect(PLAYER_1, BattleOptions.Sword, true);
    doSelect(PLAYER_2, BattleOptions.Sword, true);

    player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(player1_points, 0, "test_battleLogs::17");
    assertEq(player2_points, 1, "test_battleLogs::18");

    assertEq(player1_battleResult.totalWins, 0, "test_battleLogs::19");
    assertEq(player1_battleResult.totalLoses, 1, "test_battleLogs::20");
    assertEq(player2_battleResult.totalWins, 1, "test_battleLogs::21");
    assertEq(player2_battleResult.totalLoses, 0, "test_battleLogs::22");

    player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.outcome), uint256(BattleOutcomeType.DRAW), "test_battleOutcome::23");
    assertEq(uint256(player2_battleData.outcome), uint256(BattleOutcomeType.DRAW), "test_battleOutcome::24");
  }

  function test_removeBattleLogs() public {
    vm.prank(PLAYER_1, PLAYER_1);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.play();

    // Player 1, lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, false);
    doSelect(PLAYER_2, BattleOptions.Sword, false);

    vm.warp(block.timestamp + 31); // warp to deadline

    // Players lock In
    doSelect(PLAYER_1, BattleOptions.Scroll, true);
    doSelect(PLAYER_2, BattleOptions.Sword, true);

    BattleComponentData memory player1_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleComponentData memory player2_battleData = BattleComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    uint256 player1_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_1))));
    uint256 player2_points = BattlePointsComponent.get(world, bytes32(uint256(uint160(PLAYER_2))));

    BattleResultsComponentsData memory player1_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_1))));
    BattleResultsComponentsData memory player2_battleResult = BattleResultsComponents.get(world, bytes32(uint256(uint160(PLAYER_2))));

    assertEq(uint256(player1_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_removeBattleLogs::1");
    assertEq(uint256(player2_battleData.status), uint256(BattleStatus.LOCKED_IN), "test_removeBattleLogs::2");

    // Player 2 wins
    assertEq(player1_points, 0, "test_removeBattleLogs::3");
    assertEq(player2_points, 1, "test_removeBattleLogs::4");

    assertEq(player1_battleResult.totalWins, 0, "test_removeBattleLogs::5");
    assertEq(player1_battleResult.totalLoses, 1, "test_removeBattleLogs::6");
    assertEq(player2_battleResult.totalWins, 1, "test_removeBattleLogs::7");
    assertEq(player2_battleResult.totalLoses, 0, "test_removeBattleLogs::8");

    // GET PLAYER_1 Battle Logs
    BattleHistoryComponentData memory player_1_history = BattleHistoryComponent.get(world, 1);

    // GET PLAYER_2 Battle logs
    BattleHistoryComponentData memory player_2_history = BattleHistoryComponent.get(world, 1);

    // player1 and player2 check for winner and loser
    assertEq(player_1_history.winner, bytes32(uint256(uint160(PLAYER_2))), "test_removeBattleLogs::9");
    assertEq(player_2_history.loser, bytes32(uint256(uint160(PLAYER_1))), "test_removeBattleLogs::10");

    // player1 and player2 check must not draw
    assertEq(player_1_history.draw, false, "test_removeBattleLogs::11");
    assertEq(player_2_history.draw, false, "test_removeBattleLogs::12");

    uint256[] memory battleLogsIds = new uint256[](1);
    battleLogsIds[0] = 1;

    // expect PLAYER_1 remove the Battle Logs and remove the winner and loser
    vm.prank(PLAYER_1, PLAYER_1);
    world.removeBattleLogs(battleLogsIds);

    player_1_history = BattleHistoryComponent.get(world, 1);
    player_2_history = BattleHistoryComponent.get(world, 1);

    assertEq(player_1_history.winner, bytes32(0), "test_removeBattleLogs::13");
    assertEq(player_2_history.loser, bytes32(0), "test_removeBattleLogs::14");
  }

  function doSelect(address player, BattleOptions selection, bool reveal) internal {
    if (reveal) {
      vm.prank(player, player);
      world.reveal(selection, "123");
    } else {
      bytes32 hash = world.encodeHash(selection, "123");
      vm.prank(player, player);
      world.onSelect(hash);
    }
  }
}
