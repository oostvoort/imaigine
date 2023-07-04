// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  SceneComponent,
  InteractableComponent,
  TravelComponent,
  TravelComponentData,
  MapCellComponent,
  LocationComponent,
  SceneComponent
} from "../codegen/Tables.sol";

import { TravelStatus } from "../codegen/Types.sol";


import { ArrayLib } from "../lib/ArrayLib.sol";

contract TravelSystem is System {

  using ArrayLib for bytes;
  using ArrayLib for uint256[];

  /// @dev the rate at which the player travels a cell
  uint256 private constant TRAVEL_SPEED = 1_000 * 15;

  /// @notice called by the player to signal that the player would like to travel
  /// @param cellNumber pertains to the cell number of the destination
  /// @return the locationId in bytes32 form
  function prepareTravel(uint256 cellNumber) public returns (bytes32) {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    TravelComponent.set(playerID, TravelStatus.PREPARING, cellNumber, 0, new bytes(0), new bytes(0));
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
      block.timestamp,
      cellNumbers.encode(),
      toRevealAtDestination.encode()
    );
    // TODO: reveal path cells
  }

  /// @notice called by the player to update the player's current location
  /// @return the current cell number the player is on
  function travel() public returns (uint256) {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    TravelComponentData memory travelData = TravelComponent.get(playerID);
    require(
      travelData.status == TravelStatus.READY_TO_TRAVEL ||
      travelData.status == TravelStatus.TRAVELLING,
      "player cannot travel yet"
    );
    uint256 cellsTravelled = (block.timestamp - travelData.lastTravelledTimestamp) / TRAVEL_SPEED;

    if (cellsTravelled == 0) return MapCellComponent.get(playerID);
    uint256[] memory path = travelData.path.decodeUint256Array();

    // has travelled through all the cells
    if (cellsTravelled >= path.length) {
      bytes32 locationID = keccak256(abi.encodePacked(bytes16("LOCATION"), travelData.destination));
      require(SceneComponent.get(locationID), "location is not ready for visiting");
      TravelComponent.set(
        playerID,
        TravelStatus.NOT_TRAVELLING,
        0,
        0,
        new bytes(0),
        new bytes(0)
      );
      LocationComponent.set(playerID, locationID);
      MapCellComponent.set(playerID, travelData.destination);

      // TODO: reveal toRevealCellsAtDestination here

      return travelData.destination;
    } else {

      uint256 newPathLength = path.length - cellsTravelled;
      uint256[] memory remainingPath = new uint256[](newPathLength);

      for (uint256 i = 0; i < newPathLength; i++) {
        remainingPath[i] = path[i + cellsTravelled];
      }

      TravelComponent.set(
        playerID,
        TravelStatus.TRAVELLING,
        travelData.destination,
        block.timestamp,
        remainingPath.encode(),
        travelData.toRevealAtDestination
      );

      MapCellComponent.set(playerID, path[cellsTravelled - 1]);

      return path[cellsTravelled - 1];
    }
  }
}
