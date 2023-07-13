// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  BattleQueueComponent,
  BattleComponent,
  BattleComponentData,
  LocationComponent,
  BattleHistoryCounter,
  BattleHistoryComponent,
  BattlePointsComponent,
  BattleResultsComponents,
  BattlePreResultsComponents
} from "../codegen/Tables.sol";

import { BattleStatus, BattleOptions } from "../codegen/Types.sol";

contract MinigameSystem is System {

  uint256 private constant FORFEIT_TIME = 1_000 * 15; // the time elapsed wherein a user is considered forfeited

  /// @notice called by the player to play rps
  function play() public returns (bytes32) {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    bytes32 locationId = LocationComponent.get(playerID);
    bytes32 opponent = BattleQueueComponent.get(locationId);

    require(opponent != playerID, "rejoining the same game");

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

  /// @notice called by the player to lock in a battle
  function battleLock() public {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    BattleComponent.setStatus(playerID, BattleStatus.LOCKED_IN);
  }

  /// @notice called by the timer to execute pre-result in a battle
  /// @param option is the actual option the player gave
  function preResult(BattleOptions option) public {
    require(option != BattleOptions.NONE, "option cannot be none");

    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    BattlePreResultsComponents.setOption(playerID, option);
  }

  /// @notice called by the player to evaluate battle
  /// @param hashSalt was the salt used to hash the option
  /// @param option is the actual option the player gave
  function lockIn(string memory hashSalt, BattleOptions option) public {
    require(option != BattleOptions.NONE, "option cannot be none");

    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    BattleComponentData memory battleComponentData = BattleComponent.get(playerID);

    require(
      keccak256(abi.encodePacked(hashSalt, option)) ==
      battleComponentData.hashedOption,
      "incorrect hash salt or option provided"
    );

    BattleComponentData memory opponentBattleData = BattleComponent.get(battleComponentData.opponent);
    if (opponentBattleData.status == BattleStatus.LOCKED_IN) {
      if (option == opponentBattleData.option) {
        logHistory(playerID, battleComponentData.opponent, option, opponentBattleData.option, true);
      } else if (option == BattleOptions.Sword) {
        if (opponentBattleData.option == BattleOptions.Scroll)
          logHistory(playerID, battleComponentData.opponent, option, opponentBattleData.option, false);
        else
          logHistory(battleComponentData.opponent, playerID, opponentBattleData.option, option, false);
      } else if (option == BattleOptions.Scroll) {
        if (opponentBattleData.option == BattleOptions.Potion)
          logHistory(playerID, battleComponentData.opponent, option, opponentBattleData.option, false);
        else
          logHistory(battleComponentData.opponent, playerID, opponentBattleData.option, option, false);
      } else {
        if (opponentBattleData.option == BattleOptions.Sword)
          logHistory(playerID, battleComponentData.opponent, option, opponentBattleData.option, false);
        else
          logHistory(battleComponentData.opponent, playerID, opponentBattleData.option, option, false);
      }
      beginMatch(playerID, battleComponentData.opponent, 0);
    } else {
      if (opponentBattleData.timestamp + FORFEIT_TIME <= block.timestamp) {
        bytes32 locationId = LocationComponent.get(playerID);
        bytes32 playerInQueue = BattleQueueComponent.get(locationId);
        kickOutPlayer(battleComponentData.opponent, playerID, playerInQueue, locationId);
      } else {
        BattleComponent.set(
          playerID,
          battleComponentData.opponent,
          option,
          battleComponentData.hashedOption,
          BattleStatus.LOCKED_IN,
          block.timestamp,
          hashSalt
        );
      }
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
      kickOutPlayer(playerID, battleData.opponent, playerInQueue, locationId);
    }
    BattleResultsComponents.set(playerID, 0, 0);
    return locationId;
  }

  function beginMatch(bytes32 player1, bytes32 player2, bytes32 locationId) internal {
    BattleComponent.set(player1, player2, BattleOptions.NONE, 0, BattleStatus.IN_BATTLE, block.timestamp, "");
    BattleComponent.set(player2, player1, BattleOptions.NONE, 0, BattleStatus.IN_BATTLE, block.timestamp, "");

    BattleQueueComponent.set(locationId, 0);
  }

  function kickOutPlayer(bytes32 playerToKickOut, bytes32 stayingPlayer, bytes32 playerInQueue, bytes32 locationId) internal {
    logHistory(stayingPlayer, playerToKickOut, BattleOptions.NONE, BattleOptions.NONE, false);
    BattleComponent.set(playerToKickOut, 0, BattleOptions.NONE, 0, BattleStatus.NOT_IN_BATTLE, 0, "");

    if (playerInQueue != 0) {
      beginMatch(stayingPlayer, playerInQueue, locationId);
    } else {
      BattleQueueComponent.set(locationId, stayingPlayer);
      BattleComponent.set(stayingPlayer, 0, BattleOptions.NONE, 0, BattleStatus.NOT_IN_BATTLE, 0, "");
    }
  }

  function logHistory(
    bytes32 winner,
    bytes32 loser,
    BattleOptions winnerOption,
    BattleOptions loserOption,
    bool draw
  ) internal {
    uint256 id = BattleHistoryCounter.get();
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    BattleHistoryComponent.set(id, winner, winnerOption, loser, loserOption, draw);
    BattleHistoryCounter.set(id + 1);

    if(!draw && BattleComponent.getStatus(winner) != BattleStatus.IN_BATTLE) {
      uint256 winnerPoints = BattlePointsComponent.get(winner) + 1;
      uint256 loserPoints = BattlePointsComponent.get(loser);
      uint256 finalLoserPoints = loserPoints == 0 ? 0 : loserPoints - 1;
      BattlePointsComponent.set(winner, winnerPoints);
      BattlePointsComponent.set(loser, loserPoints);
      BattlePreResultsComponents.setResult(winner, "Win");
      BattlePreResultsComponents.setResult(loser, "Lose");
      resultsBattle(1, 0, winner);
      resultsBattle(0, 1, loser);
    }
  }

  function resultsBattle (uint32 win, uint32 lose, bytes32 playerId) internal {

    uint32 totalWin = BattleResultsComponents.get(playerId).totalWins;
    uint32 totalLose = BattleResultsComponents.get(playerId).totalLoses;

    BattleResultsComponents.set(playerId, (totalWin + win), (totalLose + lose));
    BattlePreResultsComponents.set(playerId, "", "");
  }
}
