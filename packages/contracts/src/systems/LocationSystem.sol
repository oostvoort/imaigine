// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import { LocationComponent } from "../codegen/Tables.sol";

contract LocationSystem is System {
  event UpdatedLocation(bytes32 indexed entityID, string indexed from, string indexed to);

  /*
   * @note God's placing/relocating objects to world
   * @dev A dangerous updates to entities location/narrative, use with good intent
   */
  function setLocation(
    bytes32 entityID,
    string calldata location
  )
  public
  {
    string memory from = LocationComponent.get(entityID);
    LocationComponent.set(entityID, location);
    emit UpdatedLocation(entityID, from, location);
  }
}