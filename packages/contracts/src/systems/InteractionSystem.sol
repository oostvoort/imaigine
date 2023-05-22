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
  LogComponent
} from "../codegen/Tables.sol";

import { StringLib } from "../lib/StringLib.sol";
import { ArrayLib } from "../lib/ArrayLib.sol";

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

    for (uint256 i=0; i<participants.length; i++) {
      require(participants[i] != playerID, "player already participating");
    }

    // push to last interacting participants
    participants = participants.push(playerID);

    // wrap list of participants before saving
    InteractComponent.setParticipants(entityID, abi.encode(participants));

    return entityID;
  }

  /*
   * @dev Interacting
   */
  function saveInteraction(
    bytes32 entityID,
    bytes32 actionID,
    string memory logHash,
    bytes32[] memory participants,
    string[][] memory participantsActions
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

    require(participants[0] == playerID, "not player's turn yet or not participating yet");

    uint256 timestamp = block.timestamp;
    for (uint256 i=0; i< participants.length; i++) {
      require(participants.findIndex(participants[i]) >= 0, "trying to update player not participating");

      ActionsComponent.setActions(participants[i], entityID, participantsActions[i].encode());
      ActionsComponent.setCreatedAt(participants[i], entityID, timestamp);
    }

    if (participants.length > 1) participants.shiftIndexToLast(0);

    LogComponent.set(entityID, logHash);

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
