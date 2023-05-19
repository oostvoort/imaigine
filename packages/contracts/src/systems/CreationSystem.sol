// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

import {
  PlanetComponent,
  NameComponent,
  RaceComponent,
  DescriptionComponent,
  TangibleComponent
} from "../codegen/Tables.sol";

import { Constants } from "../lib/Constants.sol";

contract CreationSystem is System {
  function createPlanet(
    string memory theme
  )
  public
  {
    // validate input
    require(
      keccak256(abi.encodePacked(theme)) != Constants.EMPTY_HASH,
      "invalid theme"
    );

    PlanetComponent.set(theme);
  }

  function createPlayer(
    string memory name,
    string memory race
  )
  public
  returns (bytes32)
  {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    // does playerID already exist
    require(
      keccak256(abi.encodePacked(NameComponent.get(playerID))) == Constants.EMPTY_HASH,
      "name already exist"
    );
    // validate input
    require(
      keccak256(abi.encodePacked(name)) != Constants.EMPTY_HASH,
      "invalid name"
    );
    // validate input
    require(
      keccak256(abi.encodePacked(race)) != Constants.EMPTY_HASH,
      "invalid race"
    );

    NameComponent.set(playerID, name);
    RaceComponent.set(playerID, race);

    return playerID;
  }

  function createItem(
    string memory name,
    string memory description
  )
  public
  {
    bytes32 itemID = getUniqueEntity();

    NameComponent.set(itemID, name);
    DescriptionComponent.set(itemID, description);
    TangibleComponent.set(itemID, true);
  }
}
