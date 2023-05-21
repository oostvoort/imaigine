// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

interface ICreationSystem {
  function createPlanet(string memory name, string memory theme, string memory description) external;

  function createStory(
    string memory name,
    string memory summary,
    string memory theme,
    string[] memory races,
    string memory currency
  ) external returns (bytes32);

  function createPlayer(string memory name, string memory description) external returns (bytes32);

  function createCharacter(string memory name, string memory description) external returns (bytes32);

  function createItem(string memory name, string memory description) external;

  function createLocation(string memory name, string memory description) external;
}
