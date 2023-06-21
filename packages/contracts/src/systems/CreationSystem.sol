// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

import {
  StoryComponent,
  NameComponent,
  SummaryComponent,
  ImageComponent,
  LocationComponent,
  PathComponent,
  PathLocationComponent,
  RaceComponent,
  TangibleComponent,
  PlayerComponent,
  CharacterComponent,
  InteractComponent,
  InteractComponentData,
  ActionsComponent,
  AliveComponent,
  SceneComponent,
  ItemComponent,
  OwnerComponent
} from "../codegen/Tables.sol";

import { ArrayLib } from "../lib/ArrayLib.sol";
import { Constants } from "../lib/Constants.sol";

contract CreationSystem is System {
  using ArrayLib for string[];
  using ArrayLib for bytes;
  using ArrayLib for bytes32[];

  function createStory(
    string memory name,
    string memory summary,
    string memory theme,
    string[] memory races,
    string memory currency
  )
  public
  returns (bytes32)
  {
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(summary).length > 0, "invalid summary length");
    require(bytes(theme).length > 0, "invalid theme length");
    require(races.length > 0, "invalid races length");
    require(bytes(currency).length > 0, "invalid currency length");

    bytes32 storyID = getUniqueEntity();
    bytes32 themeID = getUniqueEntity();
    bytes32 currencyID = getUniqueEntity();

    bytes32[] memory racesID = new bytes32[](0);

    for (uint256 i=0; i<races.length; i++) {
      bytes32 raceID = getUniqueEntity();
      RaceComponent.set(raceID, true);
      NameComponent.set(raceID, races[i]);
      racesID.push(raceID);
    }

    StoryComponent.set(storyID, themeID, currencyID, racesID.encode());

    NameComponent.set(storyID, name);
    SummaryComponent.set(storyID, summary);
    NameComponent.set(themeID, theme);
    NameComponent.set(currencyID, currency);

    return storyID;
  }

  function createPlayer(
    string memory name,
    string memory summary,
    string memory imgHash,
    bytes32 locationID
  )
  public
  returns (bytes32)
  {
    // validate input
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(summary).length > 0, "invalid summary length");
    require(bytes(imgHash).length > 0, "invalid imgHash length");
    require(bytes(NameComponent.get(locationID)).length > 0, "location does not exist");

    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    // does playerID already exist
    require(PlayerComponent.get(playerID) == false, "player already exist");

    PlayerComponent.set(playerID, true);
    CharacterComponent.set(playerID, true);
    AliveComponent.set(playerID, true);
    NameComponent.set(playerID, name);
    SummaryComponent.set(playerID, summary);
    ImageComponent.set(playerID, imgHash);
    LocationComponent.set(playerID, locationID);

    return playerID;
  }

  function createCharacter(
    string memory name,
    string memory summary,
    string memory imgHash,
    bytes32 locationID,
    string memory initialMsg,
    string[] memory initialActions
  )
  public
  returns (bytes32)
  {
    // validate input
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(summary).length > 0, "invalid summary length");
    require(bytes(imgHash).length > 0, "invalid imgHash length");
    require(bytes(NameComponent.get(locationID)).length > 0, "location does not exist");

    bytes32 characterID = getUniqueEntity();

    CharacterComponent.set(characterID, true);
    AliveComponent.set(characterID, true);
    NameComponent.set(characterID, name);
    SummaryComponent.set(characterID, summary);
    ImageComponent.set(characterID, imgHash);
    LocationComponent.set(characterID, locationID);

    InteractComponent.set(
      characterID,
      initialMsg,
      abi.encode(new string[](0)),
      abi.encode(new bytes32[](0))
    );

    return characterID;
  }

  function createItem(
    string memory name,
    string memory summary,
    string memory imgHash,
    bytes32 locationID,
    string memory initialMsg,
    string[] memory initialActions,
    bytes32 ownerID
  )
  public
  returns (bytes32)
  {
    bytes32 itemID = getUniqueEntity();

    ItemComponent.set(itemID, true);
    NameComponent.set(itemID, name);
    SummaryComponent.set(itemID, summary);
    ImageComponent.set(itemID, imgHash);
    LocationComponent.set(itemID, locationID);

    InteractComponent.set(
      itemID,
      initialMsg,
      initialActions.encode(),
      abi.encode(new bytes32[](0))
    );

    OwnerComponent.set(itemID, ownerID);

    return itemID;
  }

  function createLocation(
    string memory name,
    string memory summary,
    string memory imgHash,
    bytes32 locationID
  )
  public
  returns (bytes32)
  {
    // validate input
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(summary).length > 0, "invalid summary length");
    require(bytes(imgHash).length > 0, "invalid imgHash length");

    SceneComponent.set(locationID, true);
    NameComponent.set(locationID, name);
    SummaryComponent.set(locationID, summary);
    ImageComponent.set(locationID, imgHash);

    return locationID;
  }

  function createPath(
    bytes32 fromLocation,
    bytes32 toLocation,
    string memory name,
    string memory summary
  )
  public
  returns (bytes32)
  {
    // validate input
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(summary).length > 0, "invalid summary length");
    require(bytes(NameComponent.get(fromLocation)).length > 0, "fromLocation does not exist");
    require(bytes(NameComponent.get(toLocation)).length > 0, "toLocation does not exist");

    bytes32 pathID = getUniqueEntity();

    PathComponent.set(pathID, true);

    PathLocationComponent.set(pathID, fromLocation, toLocation);
    NameComponent.set(pathID, name);
    SummaryComponent.set(pathID, summary);

    return pathID;
  }
}
