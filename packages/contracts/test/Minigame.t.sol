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
BattleResultsComponentsData
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

    vm.prank(PLAYER_3, PLAYER_3);
    world.play();

    vm.prank(PLAYER_2, PLAYER_2);
    world.leave();
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
