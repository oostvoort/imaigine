// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  BattleQueueComponent,
  BattleComponent,
  BattleComponentData,
  LocationComponent,
  BattleHistoryCounter,
  BattleHistoryComponent
} from "../codegen/Tables.sol";

import { BattleStatus, BattleOptions } from "../codegen/Types.sol";

contract MinigameSystem is System {

  uint256 private constant FORFEIT_TIME = 1_000 * 15; // the time elapsed wherein a user is considered forfeited

  /// @notice called by the player to play rps
  function play() public returns (bytes32) {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    bytes32 locationId = LocationComponent.get(playerID);
    bytes32 opponent = BattleQueueComponent.get(locationId);

    // TODO: get player to leave from current interaction

    if (opponent == 0) {
      BattleQueueComponent.set(locationId, playerID);
      return opponent;
    }

    beginMatch(playerID, opponent, locationId);
    return opponent;
  }

  /// @notice called by the player to battle
  /// @param hashedOption is the option hashed by a salt in the frontend
  function battle(bytes32 hashedOption) public {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    bytes32 opponent = BattleComponent.getOpponent(playerID);
    BattleComponent.setHashedOption(playerID, hashedOption);
    BattleComponent.setStatus(playerID, BattleStatus.DONE_SELECTING);
    BattleComponent.setTimestamp(playerID, block.timestamp);
  }

  /// @notice called by the player to evaluate battle
  /// @param hashSalt was the salt used to hash the option
  /// @param option is the actual option the player gave
  function lockIn(string memory hashSalt, BattleOptions option) public {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    bytes32 opponent = BattleComponent.getOpponent(playerID);
    BattleStatus opponentStatus = BattleComponent.getStatus(opponent);
    if (opponentStatus == BattleStatus.DONE_SELECTING) {

    }
  }

  /// @notice called by the player to leave rps
  function leave() public returns (bytes32) {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    bytes32 locationId = LocationComponent.get(playerID);
    bytes32 playerInQueue = BattleQueueComponent.get(locationId);

    if (playerID == playerInQueue) BattleQueueComponent.set(locationId, 0);
    else {
      BattleComponentData memory battleData = BattleComponent.get(playerID);
      logHistory(battleData.opponent, playerID, BattleOptions.NONE, BattleOptions.NONE);
      BattleComponent.set(playerID, 0, BattleOptions.NONE, 0, BattleStatus.NOT_IN_BATTLE, 0, "");
      if (playerInQueue != 0) {
        beginMatch(battleData.opponent, playerInQueue, locationId);
      } else {
        BattleQueueComponent.set(locationId, battleData.opponent);
        BattleComponent.set(battleData.opponent, 0, BattleOptions.NONE, 0, BattleStatus.NOT_IN_BATTLE, 0, "");
      }
    }
    return locationId;
  }

  function beginMatch(bytes32 player1, bytes32 player2, bytes32 locationId) internal {
    BattleComponent.set(player1, player2, BattleOptions.NONE, 0, BattleStatus.IN_BATTLE, block.timestamp, "");
    BattleComponent.set(player2, player1, BattleOptions.NONE, 0, BattleStatus.IN_BATTLE, block.timestamp, "");

    BattleQueueComponent.set(locationId, 0);
  }

  function logHistory(
    bytes32 winner,
    bytes32 loser,
    BattleOptions winnerOption,
    BattleOptions loserOption
  ) internal {
    uint256 id = BattleHistoryCounter.get();
    BattleHistoryComponent.set(id, winner, winnerOption, loser, loserOption);
    BattleHistoryCounter.set(id + 1);
  }
}
