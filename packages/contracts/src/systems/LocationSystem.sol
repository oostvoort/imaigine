// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import { LocationComponent } from "../codegen/Tables.sol";

contract LocationSystem is System {
  function setLocation(
    bytes32 entityID,
    string calldata location
  )
  public
  {
    LocationComponent.set(entityID, location);
  }
}