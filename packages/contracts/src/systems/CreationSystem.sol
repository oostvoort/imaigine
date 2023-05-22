// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

import {
  PlanetComponent,
  PlanetComponentTableId,
  StoryComponent,
  NameComponent,
  SummaryComponent,
  ImageComponent,
  LocationComponent,
  PathComponent,
  PathLocationComponent,
  RaceComponent,
  DescriptionComponent,
  TangibleComponent,
  PlayerComponent,
  CharacterComponent
} from "../codegen/Tables.sol";

import { Constants } from "../lib/Constants.sol";

contract CreationSystem is System {

  event CreatedStory(bytes32 indexed storyID, string indexed name, string indexed theme, string summary);
  event CreatedPlayer(bytes32 indexed entityID, bytes32 indexed locationID, string indexed name, string summary, string imgHash);
  event CreatedCharacter(bytes32 indexed entityID, bytes32 indexed locationID, string indexed name, string summary, string imgHash);
  event CreatedLocation(bytes32 indexed locationID, string indexed name, string summary, string imgHash);
  event CreatedPath(bytes32 indexed from, bytes32 indexed to, string name, string summary);

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
    bytes32 racesID = getUniqueEntity();
    bytes32 currencyID = getUniqueEntity();

    StoryComponent.set(storyID, themeID, racesID, currencyID);

    NameComponent.set(storyID, name);
    SummaryComponent.set(storyID, summary);
    NameComponent.set(themeID, theme);
    NameComponent.set(currencyID, currency);

    for(uint256 i=0; i<races.length; i++) {
      require(bytes(races[i]).length > 0, string(abi.encodePacked("invalid races[", i, "] length")));
      NameComponent.set(racesID, races[i]);
    }

    emit CreatedStory(storyID, name, theme, summary);

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
    NameComponent.set(playerID, name);
    SummaryComponent.set(playerID, summary);
    ImageComponent.set(playerID, imgHash);
    LocationComponent.set(playerID, locationID);

    emit CreatedPlayer(playerID, locationID, name, summary, imgHash);

    return playerID;
  }

  function createCharacter(
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

    bytes32 characterID = getUniqueEntity();

    CharacterComponent.set(characterID, true);
    NameComponent.set(characterID, name);
    SummaryComponent.set(characterID, summary);
    ImageComponent.set(characterID, imgHash);
    LocationComponent.set(characterID, locationID);

    emit CreatedCharacter(characterID, locationID, name, summary, imgHash);

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
    string memory summary,
    string memory imgHash
  )
  public
  returns (bytes32)
  {
    // validate input
    require(bytes(name).length > 0, "invalid name length");
    require(bytes(summary).length > 0, "invalid summary length");
    require(bytes(imgHash).length > 0, "invalid imgHash length");

    bytes32 locationID = getUniqueEntity();

    NameComponent.set(locationID, name);
    SummaryComponent.set(locationID, summary);
    ImageComponent.set(locationID, imgHash);

    emit CreatedLocation(locationID, name, summary, imgHash);

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

    PathComponent.set(fromLocation, toLocation, true);

    PathLocationComponent.set(pathID, fromLocation, toLocation);
    NameComponent.set(pathID, name);
    SummaryComponent.set(pathID, summary);

    emit CreatedPath(fromLocation, toLocation, name, summary);

    return pathID;
  }
}
