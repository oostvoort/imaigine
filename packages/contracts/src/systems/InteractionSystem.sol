// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";

import { System } from "@latticexyz/world/src/System.sol";

import {
  PlayerComponent,
  KarmaPointsComponent
} from "../codegen/Tables.sol";

import { ArrayLib } from "../lib/ArrayLib.sol";
import { Constants } from "../lib/Constants.sol";

contract InteractionSystem is System {

  /// @dev Ideally the change in karma points should be performed by the Backend
  function changeKarmaPoints(
    address forPlayer,
    int8 karmaPoints
  )
  public
  returns (bytes32)
  {
    bytes32 playerID = bytes32(uint256(uint160(forPlayer)));

    require(PlayerComponent.get(playerID), "cannot change karma for nonPlayer entity");
    int8 oldKarmaPoints = KarmaPointsComponent.get(playerID);
    KarmaPointsComponent.set(playerID, oldKarmaPoints + karmaPoints);
    return playerID;
  }
}
