// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

import {
  PlanetComponent,
  PlanetComponentTableId,
  NameComponent,
  RaceComponent,
  DescriptionComponent,
  TangibleComponent,
  PlayerComponent,
  CharacterComponent
} from "../codegen/Tables.sol";

import { Constants } from "../lib/Constants.sol";

contract CreationSystem is System {
  function createPlanet(
    string memory name,
    string memory theme,
    string memory description
  )
  public
  {
    // validate input
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(theme).length > 0, "invalid theme length");
    require(bytes(description).length > 0, "invalid description length");

    PlanetComponent.set(name, theme);
    DescriptionComponent.set(PlanetComponentTableId, description);
  }

  function createPlayer(
    string memory name,
    string memory description
  )
  public
  returns (bytes32)
  {
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    // does playerID already exist
    require(PlayerComponent.get(playerID) == false, "player already exist");

    // validate input
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(description).length > 0, "invalid description length");

    NameComponent.set(playerID, name);
    DescriptionComponent.set(playerID, description);
    PlayerComponent.set(playerID, true);

    return playerID;
  }


  function createCharacter(
    string memory name,
    string memory description
  )
  public
  returns (bytes32)
  {
    bytes32 characterID = getUniqueEntity();

    // does playerID already exist
    require(
      keccak256(abi.encodePacked(NameComponent.get(characterID))) == Constants.EMPTY_HASH,
      "name already exist"
    );

    // validate input
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(description).length > 0, "invalid description length");

    NameComponent.set(characterID, name);
    DescriptionComponent.set(characterID, description);

    return characterID;
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

  function createLocation(
    string memory name,
    string memory description
  )
  public
  {
    bytes32 locationID = getUniqueEntity();

    NameComponent.set(locationID, name);
    DescriptionComponent.set(locationID, description);
  }
}
