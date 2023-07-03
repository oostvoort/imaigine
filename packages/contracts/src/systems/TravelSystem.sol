// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  SceneComponent,
  InteractableComponent,
  TravelComponent,
  TravelComponentData
} from "../codegen/Tables.sol";

import { TravelStatus } from "../codegen/Types.sol";


import { ArrayLib } from "../lib/ArrayLib.sol";

contract TravelSystem is System {

  using ArrayLib for uint256[];

  /// @notice called by the player to signal that the player would like to travel
  /// @param cellNumber pertains to the cell number of the destination
  /// @return the locationId in bytes32 form
  function prepareTravel(uint256 cellNumber) public returns (bytes32) {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    TravelComponent.set(playerID, TravelStatus.PREPARING, cellNumber, new bytes(0), new bytes(0));
    return keccak256(abi.encodePacked(bytes16("LOCATION"), cellNumber));
  }

  /// @notice called by the backend to process the player's travel
  /// @param playerId is the player that will start travelling
  /// @param cellNumbers is a list of cells the player will travel through
  /// @param toRevealAtDestination are the cells to reveal when player has arrived
  function startTravel(
    bytes32 playerId,
    uint256[] memory cellNumbers,
    uint256[] memory toRevealAtDestination
  ) public {
    TravelStatus status = TravelComponent.getStatus(playerId);
    require(status == TravelStatus.PREPARING, "player is not preparing to travel");
    TravelComponentData memory travelData = TravelComponent.get(playerId);
    TravelComponent.set(
      playerId,
      TravelStatus.READY_TO_TRAVEL,
      travelData.destination,
      cellNumbers.encode(),
      toRevealAtDestination.encode()
    );
  }

  /// @notice called by the player to update the player's current location
  /// @return the current cell number the player is on
  function travel() public returns (uint256) {
    TravelStatus status = TravelComponent.getStatus(playerId);
    require(status == TravelStatus.READY_TO_TRAVEL || status == TravelStatus.TRAVELLING, "player cannot travel yet");
    return 5;
  }
}
