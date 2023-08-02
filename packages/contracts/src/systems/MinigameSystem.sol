// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {System} from "@latticexyz/world/src/System.sol";

import {console} from "forge-std/console.sol";

import {
BattleQueueComponent,
BattleComponent,
BattleComponentData,
LocationComponent,
BattleHistoryCounter,
BattleHistoryComponent,
BattlePointsComponent,
BattleResultsComponents,
BattleResultsComponentsData,
BattlePreResultsComponents,
BattleTimeComponent
} from "../codegen/Tables.sol";

import {BattleStatus, BattleOptions, BattleOutcomeType} from "../codegen/Types.sol";

contract MinigameSystem is System {

  function setUpPlayer(bytes32 playerId, bytes32 locationId) public {
    LocationComponent.set(playerId, locationId);
  }

  function play() public {
    // get player id
    bytes32 playerId = bytes32(uint256(uint160(_msgSender())));

    // get player location
    bytes32 playerLocationId = LocationComponent.get(playerId);

    playInternal(playerId, playerLocationId);
  }

  function playInternal(bytes32 playerId, bytes32 playerLocationId) internal {
    bytes32 opponentInQueue = BattleQueueComponent.get(playerLocationId);

    // check if player in queue has nothing
    if (opponentInQueue == 0) {
      BattleQueueComponent.set(playerLocationId, playerId);
    } else {
      BattleQueueComponent.deleteRecord(playerLocationId);
      beginMatch(playerId, opponentInQueue);
    }
  }

  // @note Call to select battle options, encrypted
  // @dev hash is keccack256(abi.encode(uint256, string)) of;
  // selection  => selected option
  // salt       => can be anything from timestamp to uuid
  function onSelect(bytes32 hash) public {
    // get player id
    bytes32 playerId = bytes32(uint256(uint160(_msgSender())));
    uint256 deadline = BattleComponent.getDeadline(playerId);

    // deadline should be defined
    require(deadline != 0, "onSelect: not in battle");
    // should be within the deadline
    require(block.timestamp < deadline, "onSelect: already deadline");

    // update hash of battle component of player id
    BattleComponent.setHashedOption(playerId, hash);

    // update battle status into DONE_SELECTING by player id
    BattleComponent.setStatus(playerId, BattleStatus.DONE_SELECTING);
  }

  // @note Call to evaluate battle, reveal player's selection
  // @dev selection must be acompandies by salt
  function reveal(BattleOptions selection, string memory salt) public {
    bytes32 playerId = bytes32(uint256(uint160(_msgSender())));

    // encrypt option, salt
    bytes32 encrypted = encodeHash(selection, salt);

    bytes32 hash = BattleComponent.getHashedOption(playerId);
    uint256 deadline = BattleComponent.getDeadline(playerId);

    // only accept when outside the deadline
    require(block.timestamp >= deadline, "reveal: not yet deadline");
    // check if encrypted is equal to hash
    require(encrypted == hash, "reveal: incorrect option or salt");

    // update player battle status to LOCKED_IN
    BattleComponent.setStatus(playerId, BattleStatus.LOCKED_IN);

    // set player battle selection
    BattleComponent.setOption(playerId, selection);

    beginBattle(playerId);
  }

  function encodeHash(BattleOptions selection, string memory salt) public pure returns (bytes32) {
    return keccak256(abi.encode(uint256(selection), salt));
  }

  // @note Call to re-calculate battle after deadline, used for kicking inactive opponent
  function validateBattle() public {
    bytes32 playerId = bytes32(uint256(uint160(_msgSender())));
    bytes32 opponentId = BattleComponent.getOpponent(playerId);

    require(opponentId != 0, "validateBattle: not in battle");

    beginBattle(playerId);
  }

  // @dev Can only be called after deadline
  function beginBattle(bytes32 playerId) internal {
    // get player's selection
    BattleOptions playerSelection = BattleComponent.getOption(playerId);

    // get player's opponent
    bytes32 opponentId = BattleComponent.getOpponent(playerId);

    // get opponent's battle status and selection
    BattleStatus opponentStatus = BattleComponent.getStatus(opponentId);
    BattleOptions opponentSelection = BattleComponent.getOption(opponentId);

    uint256 deadline = BattleComponent.getDeadline(playerId);
    // either; -1, 0, 1, 2
    int256 winner = - 1;
    bool isForfieted = false;

    if (opponentStatus == BattleStatus.LOCKED_IN) {
      winner = calculateBattle(playerSelection, opponentSelection);
    } else {
      uint256 forfeitDeadline = deadline + 30; // 30secs after deadline
      if (block.timestamp < forfeitDeadline) return;

      // opponent forfieted, so player is the winner
      winner = 1;
      isForfieted = true;
    }

    if (winner > - 1) {
      recordPoints(playerId, opponentId, winner);

      if (isForfieted) {

        // back player to queue
        bytes32 locationId = LocationComponent.get(playerId);
        BattleQueueComponent.set(locationId, playerId);

        // clean up battle
        BattleComponent.deleteRecord(playerId);
        BattleComponent.deleteRecord(opponentId);

        BattleResultsComponents.deleteRecord(playerId);
        BattleResultsComponents.deleteRecord(opponentId);
      } else {
        recordBattleResult(playerId, opponentId, winner);
      }
    }
  }

  function rematch() public {
    bytes32 playerId = bytes32(uint256(uint160(_msgSender())));
    BattleComponentData memory playerBattleData = BattleComponent.get(playerId);

    require(playerBattleData.opponent != 0, "rematch: no opponent");
    if (playerBattleData.status == BattleStatus.IN_BATTLE) return;

    beginMatch(playerId, playerBattleData.opponent);
  }

  function leave() public {
    bytes32 playerId = bytes32(uint256(uint160(_msgSender())));
    bytes32 locationId = LocationComponent.get(playerId);


    bytes32 playerInQueue = BattleQueueComponent.get(locationId);
    bytes32 opponentId = BattleComponent.getOpponent(playerId);

    if (playerId == playerInQueue) {
      // clear queue if applicable
      BattleQueueComponent.deleteRecord(locationId);
    } else if (opponentId != 0) {
      // clear battle
      BattleComponent.deleteRecord(playerId);
      BattleResultsComponents.deleteRecord(playerId);
      // push opponent to queue if applicable
      BattleComponent.deleteRecord(opponentId);
      BattleResultsComponents.deleteRecord(opponentId);

      // +1 point for opponent if applicable
      recordPoints(playerId, opponentId, 2);

      // try to push opponent to another player or in queue
      playInternal(opponentId, locationId);
    } else {
      require(false, "leave: not in queue or battle");
    }
  }

  function beginMatch(bytes32 playerId, bytes32 opponentId) internal {
    uint256 deadline = block.timestamp + 30; // 30 sec

    // Player1
    BattleComponent.set(
      playerId,
      opponentId,
      BattleOptions.NONE,
      0,
      BattleStatus.IN_BATTLE,
      deadline,
      BattleOutcomeType.NONE,
      ""
    );

    // Opponent
    BattleComponent.set(
      opponentId,
      playerId,
      BattleOptions.NONE,
      0,
      BattleStatus.IN_BATTLE,
      deadline,
      BattleOutcomeType.NONE,
      ""
    );
  }

  // @return battle winner
  // 0 => draw
  // 1 => option1 winner
  // 2 => option2 winner
  function calculateBattle(BattleOptions option1, BattleOptions option2) internal view returns (int256){
    if (option1 == option2) {
      return 0;
    }

    if (option1 == BattleOptions.Sword) {
      if (option2 == BattleOptions.Scroll) return 1; // option1.Sword, option2.Scroll
      else return 2; // option1.Sword, option2.Potion
    } else if (option1 == BattleOptions.Scroll) {
      if (option2 == BattleOptions.Potion) return 1; // option1.Scroll, option2.Potion
      else return 2; // option1.Scroll, option2.Sword
    } else {
      if (option2 == BattleOptions.Sword) return 1; // option1.Potion, option2.Sword
      else return 2; // option1.Potion, option2.Scroll
    }
  }

  function recordBattleResult(bytes32 playerId, bytes32 opponentId, int256 winner) internal {
    BattleResultsComponentsData memory playerBattleResult = BattleResultsComponents.get(playerId);
    BattleResultsComponentsData memory opponentBattleResult = BattleResultsComponents.get(opponentId);

    if (winner == 1) {
      BattleResultsComponents.setTotalWins(playerId, playerBattleResult.totalWins + 1);
      BattleResultsComponents.setTotalLoses(opponentId, opponentBattleResult.totalLoses + 1);
    } else if (winner == 2) {
      BattleResultsComponents.setTotalWins(opponentId, opponentBattleResult.totalWins + 1);
      BattleResultsComponents.setTotalLoses(playerId, playerBattleResult.totalLoses + 1);
    }
  }

  function recordPoints(bytes32 playerId, bytes32 opponentId, int256 winner) internal {
    uint256 playerPoints = BattlePointsComponent.get(playerId);
    uint256 opponentPoints = BattlePointsComponent.get(opponentId);

    if (winner == 1) {
      BattlePointsComponent.set(playerId, playerPoints + 1);
    } else if (winner == 2) {
      BattlePointsComponent.set(opponentId, opponentPoints + 1);
    }
  }
}
