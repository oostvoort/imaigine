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
  /// @param cellNumber pertains to the cell number of the destination
  /// @return the locationId in bytes32 form
  function prepareTravel(uint256 cellNumber) public returns (bytes32) {
    bytes32 locationId = keccak256(abi.encodePacked(bytes16("LOCATION"), cellNumber));
    return locationId;
  }

  /// @dev called by the backend to process the player's travel
  /// @param playerId is the player that will start travelling
  /// @param cellNumbers is a list of cells the player will travel through
  function startTravel(bytes32 playerId, uint256[] memory cellNumbers) public {

  }

  /// @dev called by the player to update the player's current location
  /// @return the current cell number the player is on
  function travel() public returns (uint256) {
    return 5;
  }
}
