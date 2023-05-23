// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";

import { System } from "@latticexyz/world/src/System.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";

import {
  SummaryComponent,
  InteractComponent,
  InteractComponentData,
  ActionsComponent,
  LogComponent,
  PossibleComponent,
  AttributeIntComponent
} from "../codegen/Tables.sol";

import { StringLib } from "../lib/StringLib.sol";
import { ArrayLib } from "../lib/ArrayLib.sol";
import { Types } from "../types.sol";

contract InteractionSystem is System {
  using StringLib for string;
  using ArrayLib for bytes;
  using ArrayLib for bytes32[];
  using ArrayLib for string;
  using ArrayLib for string[];

  /*
   * @dev Interact with other entity
   */
  function enterInteraction(
    bytes32 entityID
  )
  public
  returns (bytes32)
  {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    InteractComponentData memory interactData = InteractComponent.get(entityID);

    // can entity be interacted
    require(interactData.initialMsg.isEmpty() == false, "entity cannot be interacted");

    // unwrap participants
    bytes32[] memory participants = interactData.participants.decodeBytes32Array();

    // make sure participant is already in list
    for (uint256 i=0; i<participants.length; i++) {
      if (participants[i] == playerID) {
        return entityID;
      }
    }

    // push to last interacting participants
    participants = participants.push(playerID);

    // wrap list of participants before saving
    InteractComponent.setParticipants(entityID, abi.encode(participants));

    return entityID;
  }

  /// @dev Interacting
  /// @param entityID The character to interact
  /// @param actionIndex The action index list of action to apply, value max(bytes32) for initial interaction
  /// @param logHash The hash of log of the interaction
  /// @param participants The list of participants currently participating on the interaction
  /// @param participantsActions The list of option of actions for the participants
  function saveInteraction(
    bytes32 entityID,
    uint256 actionIndex,
    string memory logHash,
    bytes32[] memory participants,
    uint256[] memory participantsActionsLength,
    bytes[] memory participantsActions
  )
  public
  returns (bytes32)
  {
    require(participants.length == participantsActionsLength.length, "invariance with participants and participantsActionsLength length");
    require(participants.length == participantsActions.length, "invariance with participants and participantsActions length");

    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    InteractComponentData memory interactData = InteractComponent.get(entityID);

    // can entity be interacted
    require(interactData.initialMsg.isEmpty() == false, "entity cannot be interacted");

    // unwrap participants
    bytes32[] memory cached_participants = interactData.participants.decodeBytes32Array();

    // TODO: verify the deadline of participants
    // require(participants[0] == playerID, "not player's turn yet or not participating yet");

    require(cached_participants.length > 0, "cached_participants length is 0");

    // max value is a representation of initial interaction and should have no kind of any effect
    if (actionIndex < type(uint256).max) {
      bytes memory raw_actions = PossibleComponent.getActions(cached_participants[0], entityID);
      if (raw_actions.length > 0) {
        Types.ActionData[] memory action = abi.decode(raw_actions, (Types.ActionData[]));

        bytes32 attrID = bytes32(abi.encode("karma"));

        // calculate changes to attr
        int256 currKarma = AttributeIntComponent.get(cached_participants[0], attrID);
        int256 nextKarma = currKarma + action[actionIndex].karmaChange;

        // update attr value
        AttributeIntComponent.set(cached_participants[0], attrID, nextKarma);
      }
    }

    require(participants.length == cached_participants.length, "invariance with participants and cached_participants length");

    uint256 timestamp = block.timestamp;
    for (uint256 i=0; i< participants.length; i++) {
      require(participants.findIndex(cached_participants[i]) >= 0, "trying to update player not participating");

      // TODO: multiplayer here, kick not responding participants

      PossibleComponent.set(participants[i], entityID, timestamp, participantsActionsLength[i], participantsActions[i]);
    }

    // put the current participant to the last item of the list
//    if (cached_participants.length > 1) {
//      cached_participants = cached_participants.shiftIndexToLast(0);
//      InteractComponent.setParticipants(entityID, abi.encode(cached_participants));
//    }

    LogComponent.set(entityID, logHash);

    return entityID;
  }

  function leaveInteraction(
    bytes32 entityID,
    bytes32 otherPlayerID
  )
  public
  returns (bytes32)
  {
    bytes32[] memory participants = InteractComponent.getParticipants(entityID).decodeBytes32Array();

    int256 index = participants.findIndex(otherPlayerID);
    require(index >=0, "trying to remove a not participant");

    // casting to uint256 should be safe
    participants = participants.remove(uint256(index));

    InteractComponent.setParticipants(entityID, abi.encode(participants));
    ActionsComponent.deleteRecord(otherPlayerID, entityID);

    return entityID;
  }

  function setEntityInitialActions(
    bytes32 entityID,
    string[] memory initialActions
  )
  public
  returns (bytes32)
  {
    require(InteractComponent.getInitialMsg(entityID).isEmpty() == false, "entity does not exist");

    InteractComponent.setInitialActions(entityID, initialActions.encode());

    return entityID;
  }
}
