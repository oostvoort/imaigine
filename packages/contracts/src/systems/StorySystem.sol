// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import { StoryActionComponent } from "../codegen/Tables.sol";

contract StorySystem is System {
  function setPlayerStory(bytes32 playerID, bytes32[] memory actionIDs, bytes[] memory actions)
  public
  {
    require(actionIDs.length == actions.length, "invariance to actionIDs and actions length");

    for (uint256 i=0; i<actionIDs.length; i++) {
      StoryActionComponent.set(playerID, actionIDs[i], actions[i]);
    }
  }
}
