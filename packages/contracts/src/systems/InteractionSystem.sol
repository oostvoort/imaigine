// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";

import { System } from "@latticexyz/world/src/System.sol";

import {
  PlayerComponent,
  LocationComponent,
  KarmaPointsComponent,
  SingleInteractionComponent,
  SingleInteractionComponentData,
  MultiInteractionComponent,
  MultiInteractionComponentData,
  InteractionTypeComponent,
  InteractableComponent
} from "../codegen/Tables.sol";

import { InteractionType } from "../codegen/Types.sol";

import { ArrayLib } from "../lib/ArrayLib.sol";
import { Constants } from "../lib/Constants.sol";

contract InteractionSystem is System {
  using ArrayLib for bytes;
  using ArrayLib for bytes32[];
  using ArrayLib for uint256[];

  /// @dev counts if the vote has timed out without player voting
  uint256 private constant VOTING_TIMEOUT = 1_000 * 15;

  /// @dev counts if the process timed out without making interaction available
  uint256 private constant PROCESSING_TIMEOUT = 1_000 * 60 * 60;

  /// @dev returned in multiInteract when a winningChoice is not yet available
  uint256 private constant NOT_YET_AVAILABLE = 4;

  /// @dev need to make this into a constant
  int8[] private KARMA_EFFECTS = [int8(0), -5, 0, 5];

  /// @notice interact with an interactable that handles single interaction
  /// @param interactableId is the id of the interactable the player wants to interact with
  /// @param choiceId is the id of the choice; 0 - will enter into the interaction, 1-3 - actual choices
  /// @return interactableId
  function interactSingle(bytes32 interactableId, uint256 choiceId)
  public
  returns (bytes32)
  {
    // check if single interaction is possible
    require(InteractionTypeComponent.get(interactableId) == InteractionType.SINGLE, "cannot single interact");

    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    // leave old multiInteraction if was part of a multiInteraction
    bytes32 oldInteractable = InteractableComponent.get(playerID);
    if (InteractionTypeComponent.get(oldInteractable) == InteractionType.MULTIPLE) {
      MultiInteractionComponentData memory multiInteraction = MultiInteractionComponent.get(oldInteractable);
      bytes32[] memory players = multiInteraction.players.decodeBytes32Array();
      int256 playerIndex = players.findIndex(playerID);

      if (playerIndex != -1) {
        uint256[] memory choices = multiInteraction.choices.decodeUint256Array();
        uint256[] memory timeouts = multiInteraction.timeouts.decodeUint256Array();

        players.remove(uint256(playerIndex));
        choices.remove(uint256(playerIndex));
        timeouts.remove(uint256(playerIndex));

        // TODO: figure out if this is safe
        // this could cause some unintended return of stale data
        MultiInteractionComponent.set(
          oldInteractable,
          multiInteraction.available,
          multiInteraction.playerCount - 1,
          multiInteraction.processingTimeout,
          players.encode(),
          choices.encode(),
          timeouts.encode()
        );
      }
    }

    if (InteractableComponent.get(playerID) != interactableId) InteractableComponent.set(playerID, interactableId);

    if (choiceId == 0) {
      SingleInteractionComponent.set(playerID, interactableId, true, choiceId, 0);
      return interactableId; // early returning here
    }

    // get interaction
    SingleInteractionComponentData memory singleInteraction = SingleInteractionComponent.get(playerID, interactableId);

    require(
      block.timestamp >= singleInteraction.processingTimeout ||
      singleInteraction.available,
      "process has not timed out yet"
    );

    changeKarma(playerID, choiceId);
    SingleInteractionComponent.set(
      playerID,
      interactableId,
      false,
      choiceId,
      block.timestamp + PROCESSING_TIMEOUT
    );

    return interactableId;
  }

  /// @notice interact with an interactable that handles multi interaction
  /// @param interactableId is the id of the interactable the player wants to interact with
  /// @param choiceId is the id of the choice; 0 - will enter into the interaction, 1-3 - actual choices
  /// @return winningChoice (0 for disagreement, 1-3 actual choice, 4 - not yet available)
  function interactMulti(bytes32 interactableId, uint256 choiceId)
  public
  returns (uint256)
  {
    // check if multi interaction is possible
    require(InteractionTypeComponent.get(interactableId) == InteractionType.MULTIPLE, "cannot multi interact");

    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    MultiInteractionComponentData memory multiInteraction = MultiInteractionComponent.get(interactableId);

    bytes32[] memory players = multiInteraction.players.decodeBytes32Array();

    if (!multiInteraction.available) {
      require(multiInteraction.processingTimeout < block.timestamp, "not ready for interaction");

      for (uint256 i = 0; i < multiInteraction.playerCount; i++) {
        InteractableComponent.set(players[i], LocationComponent.get(players[i]));
      }

      // reset the state for the interactable
      MultiInteractionComponent.set(interactableId, true, 0, 0, new bytes(0), new bytes(0), new bytes(0));
      return NOT_YET_AVAILABLE; // returning early
    }

    uint256[] memory choices = multiInteraction.choices.decodeUint256Array();
    uint256[] memory timeouts = multiInteraction.timeouts.decodeUint256Array();

    int256 playerIndex = players.findIndex(playerID);

    if (choiceId == 0) {
      require(playerIndex == -1, "player has already entered interaction");
      players.push(playerID);
      choices.push(choiceId);
      timeouts.push(block.timestamp + PROCESSING_TIMEOUT);

      MultiInteractionComponent.set(
        interactableId,
        true,
        multiInteraction.playerCount + 1,
        block.timestamp + PROCESSING_TIMEOUT,
        players.encode(),
        choices.encode(),
        timeouts.encode()
      );
      InteractableComponent.set(playerID, interactableId);
      return NOT_YET_AVAILABLE; // early returning here
    }

    require(playerIndex != -1, "player has not entered interaction yet");
    require(choiceId > 0 && choiceId < 4, "unknown choice");

    choices[uint256(playerIndex)] = choiceId;
    timeouts[uint256(playerIndex)] = block.timestamp + VOTING_TIMEOUT;

    bytes32[] memory updatedPlayers = new bytes32[](0);
    uint256[] memory updatedChoices = new uint256[](0);
    uint256[] memory updatedTimeouts = new uint256[](0);

    uint256 updatedPlayerCount = multiInteraction.playerCount;
    uint256 nonzeroChoicesCount = 0;

    // remove timed out zero choices
    for (uint256 i = 0; i < multiInteraction.playerCount; i++) {
      if (choices[i] != 0 || timeouts[i] > block.timestamp)  {
        updatedPlayers.push(players[i]);
        updatedChoices.push(choices[i]);
        updatedTimeouts.push(timeouts[i]);
        if (choices[i] != 0) nonzeroChoicesCount++;
      } else {
        // change to interact with the Location
        InteractableComponent.set(players[i], LocationComponent.get(players[i]));
        updatedPlayerCount--;
      }
    }

    MultiInteractionComponent.set(
      interactableId,
      true,
      updatedPlayerCount,
      block.timestamp + PROCESSING_TIMEOUT,
      updatedPlayers.encode(),
      updatedChoices.encode(),
      updatedTimeouts.encode()
    );

    // not everyone has voted, so the interaction is not yet over
    if (nonzeroChoicesCount != updatedPlayerCount) return NOT_YET_AVAILABLE;

    MultiInteractionComponent.setAvailable(interactableId, false);

    uint256 winner = winningChoice(interactableId);

    // if the winningChoice is 0, the players disagreed
    // TODO: figure out if karma points should be hit when disagreement has occurred
    if (winner == 0) return NOT_YET_AVAILABLE;

    for (uint256 i = 0; i < updatedPlayerCount; i++) {
      changeKarma(updatedPlayers[i], winner);
    }

    return winner;
  }

  /// @notice backend sends this to allow players to choose again
  /// @param playerId is the playerId in single player mode or can be bytes(0) for multiplayer
  function openInteraction(bytes32 playerId)
  public {
    bytes32 interactableId = InteractableComponent.get(playerId);
    InteractionType interactionType = InteractionTypeComponent.get(interactableId);
    require(interactionType != InteractionType.NOT_INTERACTABLE, "cannot open interaction for non-interactable");
    if (interactionType == InteractionType.SINGLE) {
      SingleInteractionComponent.set(playerId, interactableId, true, 0, 0);
    } else {
      MultiInteractionComponentData memory multiInteraction = MultiInteractionComponent.get(interactableId);
      uint256[] memory array = new uint256[](multiInteraction.playerCount);
      bytes memory encodedArray = array.encode();
      MultiInteractionComponent.set(
        interactableId,
        true,
        multiInteraction.playerCount,
        0,
        multiInteraction.players,
        encodedArray,
        encodedArray
      );
    }
  }

  /// @notice gets the choice a player made in a single interaction
  /// @param playerId is the player's address in bytes32
  function getPlayerChoiceInSingleInteraction(bytes32 playerId)
  public
  view
  returns(uint256) {

    return SingleInteractionComponent.getChoice(playerId, InteractableComponent.get(playerId));
  }

  /// @notice gets the winning choice for a multi interaction
  /// @param interactableId is the id of the multiInteractable entity
  function winningChoice(bytes32 interactableId)
  public
  view
  returns(uint256) {
    bytes memory choicesBytes = MultiInteractionComponent.getChoices(interactableId);
    uint256[] memory choices = choicesBytes.decodeUint256Array();
    uint256[] memory choiceCounts = new uint256[](4);

    // calculate number of players that chose that choice
    for (uint256 i = 0; i < choices.length; i++) {
      choiceCounts[choices[i]]++;
    }

    // get the largest amount of players that picked a choice
    uint256 largestChoiceCount = 0;
    for(uint256 i = 0; i < choiceCounts.length; i++) {
      if (choiceCounts[i] > largestChoiceCount) largestChoiceCount = choiceCounts[i];
    }

    // get the choice with the largest amounts of votes
    uint256 winner = 0;
    for (uint256 i = 0; i < choiceCounts.length; i++) {
      if (largestChoiceCount == choiceCounts[i]) {
        if (winner == 0) winner = choiceCounts[i];
        // meaning that there were two or more largest number meaning the players disagreed
        else return 0;
      }
    }

    return winner;
  }

  function changeKarma(bytes32 playerId, uint256 choiceId)
  private
  {
    require(choiceId > 0 && choiceId < 4, "unknown choice");
    int8 karmaPoints = KarmaPointsComponent.get(playerId);

    KarmaPointsComponent.set(playerId, karmaPoints + KARMA_EFFECTS[choiceId]);

  }

}
