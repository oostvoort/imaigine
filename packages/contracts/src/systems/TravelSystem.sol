// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  SceneComponent,
  InteractableComponent,
  TravelComponent
} from "../codegen/Tables.sol";

import { TravelStatus } from "../codegen/Types.sol";


import { ArrayLib } from "../lib/ArrayLib.sol";

contract TravelSystem is System {

  /// @dev called by the player to signal that the player would like to travel
  /// @param locationId pertains to the cell number of the destination
  /// @preturn the locationId in bytes32 form
  function prepareTravel(uint256 cellNumber) public returns (bytes32) {
    bytes32 locationId = keccak256(abi.encodePacked(bytes16("LOCATION"), cellNumber));
    require(SceneComponent.get(locationId), "location does not exist");

    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    // making it so that the player is not interacting with anything
    InteractableComponent.set(playerID, new bytes(0));
    TravelComponent.set(playerID, TravelStatus.)


    return locationId;
  }
}
