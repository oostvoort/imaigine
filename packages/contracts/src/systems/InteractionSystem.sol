// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";

import { System } from "@latticexyz/world/src/System.sol";

import {
  PlayerComponent,
  KarmaPointsComponent,
  CharacterComponent,
  VotingComponent,
  LocationComponent,
  CounterpartComponent
} from "../codegen/Tables.sol";

import { VotingStatusType } from "../codegen/Types.sol";

import { ArrayLib } from "../lib/ArrayLib.sol";
import { Constants } from "../lib/Constants.sol";

contract InteractionSystem is System {
  using ArrayLib for bytes;
  using ArrayLib for bytes32[];

  struct VoteStruct {
    bytes32 player;
    uint8 choice; // 0 for no vote yet, 1-3 actual choices
  }

  /// @dev Ideally the change in karma points should be performed by the Backend
  function changeKarmaPoints(
    address forPlayer,
    int8 karmaPoints
  )
  public
  returns (bytes32)
  {
    bytes32 playerID = bytes32(uint256(uint160(forPlayer)));
    return changeKarmaPoints(playerID, karmaPoints);
  }

  /// @dev Ideally the change in karma points should be performed by the Backend
  function changeKarmaPoints(
    bytes32 playerID,
    int8 karmaPoints
  )
  public
  returns (bytes32)
  {
    require(PlayerComponent.get(playerID), "cannot change karma for nonPlayer entity");
    int8 oldKarmaPoints = KarmaPointsComponent.get(playerID);
    KarmaPointsComponent.set(playerID, oldKarmaPoints + karmaPoints);
    return playerID;
  }

  /// @notice sent by the player to enter voting
  function enterVote(
    bytes32 npcId
  )
  public
  returns (bytes32)
  {
    require(VotingComponent.getVotingStatus(npcId) == VotingStatusType.OPEN, "must be open for voting");
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    require(CounterpartComponent.get(playerID) == LocationComponent.get(npcId), "must be interacting with the npc's location");

    bytes memory voters = VotingComponent.getVoters(npcId);

    if (voters.length == 0) {
      bytes32[] memory playerInArray = new bytes32[](0);
      playerInArray.push(playerID);
      bytes32[] memory choicesInArray = new bytes32[](0);
      choicesInArray.push(bytes32(uint256(1))); // i'm doing 1 for default
      VotingComponent.setVoters(npcId, playerInArray.encode());
      VotingComponent.setVoteChoices(npcId, choicesInArray.encode());
    } else {
      bytes32[] memory allPlayers = voters.decodeBytes32Array();
      require(allPlayers.findIndex(playerID) == -1, "already entered voting");

      bytes memory voteChoices = VotingComponent.getVoteChoices(npcId);
      bytes32[] memory allChoices = voteChoices.decodeBytes32Array();

      allPlayers.push(playerID);
      allChoices.push(bytes32(uint256(1))); // using 1 as default

      VotingComponent.setVoters(npcId, allPlayers.encode());
      VotingComponent.setVoteChoices(npcId, allChoices.encode());
    }

    CounterpartComponent.set(playerID, npcId);

    return npcId;
  }

  /// @notice sent by the player to vote
  function vote(
    bytes32 npcId,
    uint8 choice
  )
  public
  returns (bytes32)
  {
    require(VotingComponent.getVotingStatus(npcId) == VotingStatusType.OPEN, "must be open for voting");

    bytes memory voters = VotingComponent.getVoters(npcId);
    bytes32[] memory allVoters = voters.decodeBytes32Array();
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    int256 playerIndex = allVoters.findIndex(playerID);

    require(playerIndex != -1, "player has not entered voting");

    bytes memory voteChoices = VotingComponent.getVoteChoices(npcId);
    bytes32[] memory allChoices = voteChoices.decodeBytes32Array();

    require(allChoices[uint256(playerIndex)] == bytes32(uint256(1)), "player has already voted");

    bytes32[] memory newChoices = new bytes32[](0);
    for(uint256 i = 0; i < allChoices.length; i ++) {
      if (i == uint256(playerIndex)) {
        newChoices.push(bytes32(uint256(choice + 1)));
      } else {
        newChoices.push(allChoices[i]);
      }
    }

    VotingComponent.setVoteChoices(npcId, newChoices.encode());

    return npcId;
  }

  /// @notice sent by the player to close voting
  function move_to_close_vote(
    bytes32 npcId
  )
  public
  returns (bytes32)
  {
    require(VotingComponent.getVotingStatus(npcId) == VotingStatusType.OPEN, "must be open for voting");

    bytes memory voters = VotingComponent.getVoters(npcId);
    bytes32[] memory allVoters = voters.decodeBytes32Array();
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    int256 playerIndex = allVoters.findIndex(playerID);

    require(playerIndex != -1, "player has not entered voting");

    bytes memory voteChoices = VotingComponent.getVoteChoices(npcId);
    bytes32[] memory allChoices = voteChoices.decodeBytes32Array();

    for(uint256 i = 0; i < allChoices.length; i ++) {
      require(allChoices[i] != bytes32(uint256(1)), "a player has not yet voted");
    }

    VotingComponent.setVotingStatus(npcId, VotingStatusType.CLOSED);

    return npcId;
  }

  /// @notice sent by the player to exit vote
  function exit_vote(
    bytes32 npcId,
    uint8 choice
  )
  public
  returns (bytes32)
  {
    // cannot exit voting if deliberation is on going
    require(VotingComponent.getVotingStatus(npcId) == VotingStatusType.OPEN, "must be open for voting");

    bytes memory voters = VotingComponent.getVoters(npcId);
    bytes32[] memory allVoters = voters.decodeBytes32Array();
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    int256 playerIndex = allVoters.findIndex(playerID);

    require(playerIndex != -1, "player has not entered voting");

    bytes memory voteChoices = VotingComponent.getVoteChoices(npcId);
    bytes32[] memory allChoices = voteChoices.decodeBytes32Array();

    allVoters.remove(uint256(playerIndex));
    allChoices.remove(uint256(playerIndex));

    VotingComponent.set(npcId, VotingStatusType.OPEN, allVoters.encode(), allChoices.encode());

    bytes32 locationID = LocationComponent.get(playerID);
    CounterpartComponent.set(playerID, locationID);

    return locationID;
  }

  /// @notice sent by the backend to open voting
  function open_voting(
    bytes32 npcId,
    int8 karmaPoints
  )
  public
  returns (bytes32)
  {
    require(VotingComponent.getVotingStatus(npcId) == VotingStatusType.CLOSED, "must be closed for voting");

    bytes memory voters = VotingComponent.getVoters(npcId);
    bytes32[] memory allVoters = voters.decodeBytes32Array();
    bytes32[] memory resetChoices = new bytes32[](0);

    for(uint256 i = 0; i < allVoters.length; i++) {
      changeKarmaPoints(allVoters[i], karmaPoints);
      resetChoices.push(bytes32(uint256(1)));
    }

    VotingComponent.set(npcId, VotingStatusType.OPEN, voters, resetChoices.encode());

    return npcId;
  }

}
