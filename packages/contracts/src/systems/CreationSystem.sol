// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { console } from "forge-std/console.sol";

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

import {
  StoryComponent,
  ConfigComponent,
  ImageComponent,
  LocationComponent,
  PlayerComponent,
  CharacterComponent,
  AliveComponent,
  SceneComponent,
  KarmaPointsComponent,
  InteractionTypeComponent
} from "../codegen/Tables.sol";

import { InteractionType } from "../codegen/Types.sol";

import { ArrayLib } from "../lib/ArrayLib.sol";
import { Constants } from "../lib/Constants.sol";

contract CreationSystem is System {

  function createStory(
    string memory config
  )
  public
  returns (bytes32)
  {
    require(bytes(config).length > 0, "invalid config length");

    bytes32 storyID = getUniqueEntity();

    StoryComponent.set(storyID, true);
    ConfigComponent.set(storyID, config);

    return storyID;
  }

  function createPlayer(
    bytes32 playerID,
    string memory config,
    string memory imgHash,
    bytes32 locationID
  )
  public
  returns (bytes32)
  {
    // validate input
    require(bytes(config).length > 0, "invalid config length");
    require(bytes(imgHash).length > 0, "invalid imgHash length");

    // does location exist
    require(SceneComponent.get(locationID) == true, "location does not exist");

    // does playerID already exist
    require(PlayerComponent.get(playerID) == false, "player already exist");

    PlayerComponent.set(playerID, true);
    ConfigComponent.set(playerID, config);
    CharacterComponent.set(playerID, true);
    AliveComponent.set(playerID, true);
    ImageComponent.set(playerID, imgHash);
    LocationComponent.set(playerID, locationID);
    KarmaPointsComponent.set(playerID, 0);

    return playerID;
  }

  function createCharacter(
    string memory config,
    string memory imgHash,
    bytes32 locationID
  )
  public
  returns (bytes32)
  {
    // validate input
    require(bytes(config).length > 0, "invalid config length");
    require(bytes(imgHash).length > 0, "invalid imgHash length");

    // does location exist
    require(SceneComponent.get(locationID) == true, "location does not exist");

    bytes32 characterID = getUniqueEntity();

    ConfigComponent.set(characterID, config);
    CharacterComponent.set(characterID, true);
    AliveComponent.set(characterID, true);
    ImageComponent.set(characterID, imgHash);
    LocationComponent.set(characterID, locationID);
    InteractionTypeComponent.set(characterID, InteractionType.MULTIPLE);

    return characterID;
  }

  function createLocation(
    string memory config,
    string memory imgHash,
    uint256 locationNumber
  )
  public
  returns (bytes32)
  {
    // validate input
    require(bytes(config).length > 0, "invalid config length");
    require(bytes(imgHash).length > 0, "invalid imgHash length");

    bytes32 locationID = keccak256(abi.encodePacked(bytes16("LOCATION"), locationNumber));

    // does location exist
    require(SceneComponent.get(locationID) == false, "location already exists");

    ConfigComponent.set(locationID, config);
    SceneComponent.set(locationID, true);
    ImageComponent.set(locationID, imgHash);
    InteractionTypeComponent.set(locationID, InteractionType.SINGLE);

    return locationID;
  }
}
