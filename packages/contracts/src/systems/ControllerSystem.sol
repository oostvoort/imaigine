// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  ControllerComponent
} from "../codegen/Tables.sol";

contract ControllerSystem is System {
  event UpdatedOracle(address indexed oldAddress, address indexed newAddress);

  /*
   * @dev Oracle Address
   */
  function setOracle(address oracle) public {
    emit UpdatedOracle(ControllerComponent.get(), oracle);
    ControllerComponent.set(oracle);
  }
}
