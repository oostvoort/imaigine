// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

interface ICreationSystem {
  function createPlanet(string memory theme) external;

  function createPlayer(string memory name, string memory race) external returns (bytes32);

  function createItem(string memory name, string memory description) external;
}
