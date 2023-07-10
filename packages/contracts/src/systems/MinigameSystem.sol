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

    struct HashOptionsValue {
        string key;
        string data;
        uint256 timestamp;
    }

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

  /// @notice called by the player to leave rps
  function leave() public returns (bytes32) {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    bytes32 locationId = LocationComponent.get(playerID);
    bytes32 playerInQueue = BattleQueueComponent.get(locationId);

    if (playerID == playerInQueue) BattleQueueComponent.set(locationId, 0);
    else {
      BattleComponentData memory battleData = BattleComponent.get(playerID);
      logHistory(battleData.opponent, playerID, BattleOptions.NONE, BattleOptions.NONE);
      BattleComponent.set(playerID, 0, 0, BattleStatus.NOT_IN_BATTLE, "");
      if (playerInQueue != 0) {
        beginMatch(battleData.opponent, playerInQueue, locationId);
      } else {
        BattleQueueComponent.set(locationId, battleData.opponent);
        BattleComponent.set(battleData.opponent, 0, 0, BattleStatus.NOT_IN_BATTLE, "");
      }
    }
    return locationId;
  }


    // TODO NOT FINISHED
//    function lockInBetting(bytes32 playerId, bytes32 locationId, string[] memory _hashsalt) public {
//        require(_hashsalt.length == 3, "invalid hash salt");
//        require(BattleComponent.get(playerId, locationId).status == BattleStatus.IN_BATTLE, "player doesn't exist in the match");

//        HashOptionsValue memory value = HashOptionsValue({
//            key : _hashsalt[0],
//            data : _hashsalt[1],
//            timestamp : _hashsalt[2]
//        });

//        BattleComponent.pushHashSalt(playerId, locationId, value);
//    }

  function beginMatch(bytes32 player1, bytes32 player2, bytes32 locationId) internal {
    BattleComponent.set(player1, player2, 0, BattleStatus.IN_BATTLE, "");
    BattleComponent.set(player2, player1, 0, BattleStatus.IN_BATTLE, "");

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
