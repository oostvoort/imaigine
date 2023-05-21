// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  LocationComponent,
  StoryActionComponent,
  PathLocationComponent,
  PathLocationComponentData
} from "../codegen/Tables.sol";

import { Constants } from "../lib/Constants.sol";

contract TravelSystem is System {
  event UpdatedLocation(bytes32 indexed entityID, bytes32 indexed from, bytes32 indexed to);

  /*
   * @note Player's means of traveling
   * @dev deprecated
   */
  function selectPlayerLocation(
    bytes32 locationActionID
  )
  public
  {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
//    string memory from = LocationComponent.get(playerID);
//    bytes memory raw_location = StoryActionComponent.get(playerID, locationActionID);

//    require(bytes32(raw_location) != Constants.EMPTY_HASH, "invalid selected location");

//    string memory location = string(raw_location);
//    LocationComponent.set(playerID, location);

//    emit UpdatedLocation(playerID, from, location);
  }

  /*
   * @note Player's means of traveling from location to location using the available path
   */
  function playerTravelPath(
    bytes32 pathID
  )
  public
  returns (bytes32)
  {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    bytes32 fromLocationID = LocationComponent.get(playerID);

    PathLocationComponentData memory pathLocation = PathLocationComponent.get(pathID);

    // get the other end of the player's current location chosen path
    bytes32 toLocationID = pathLocation.location0 == fromLocationID ? pathLocation.location1 : pathLocation.location0;

    require(toLocationID > 0, "to location does not exist");

    LocationComponent.set(playerID, toLocationID);

    emit UpdatedLocation(playerID, fromLocationID, toLocationID);

    return toLocationID;
  }
}