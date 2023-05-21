// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import { LocationComponent, StoryActionComponent } from "../codegen/Tables.sol";

import { Constants } from "../lib/Constants.sol";

contract TravelSystem is System {
  event UpdatedLocation(bytes32 indexed entityID, string indexed from, string indexed to);

  /*
   * @note Player's means of traveling
   * @dev New story actions will be populated
   */
  function selectPlayerLocation(
    bytes32 locationActionID
  )
  public
  {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));
    string memory from = LocationComponent.get(playerID);
    bytes memory raw_location = StoryActionComponent.get(playerID, locationActionID);

    require(bytes32(raw_location) != Constants.EMPTY_HASH, "invalid selected location");

    string memory location = string(raw_location);
    LocationComponent.set(playerID, location);

    emit UpdatedLocation(playerID, from, location);
  }
}