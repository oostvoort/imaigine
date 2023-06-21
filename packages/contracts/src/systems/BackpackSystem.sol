// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  ItemComponent,
  OwnerComponent,
  LocationComponent
} from "../codegen/Tables.sol";

contract BackpackSystem is System {
  function dropItem(bytes32 itemID)
  public
  returns (bytes32)
  {
    require(ItemComponent.get(itemID), "not an item");
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    OwnerComponent.set(itemID, bytes32(0));
    LocationComponent.set(itemID, LocationComponent.get(playerID));

    return itemID;
  }

  function pickItem(bytes32 itemID)
  public
  returns (bytes32)
  {
    require(ItemComponent.get(itemID), "not an item");
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    LocationComponent.set(itemID, bytes32(0));
    OwnerComponent.set(itemID, playerID);

    return itemID;
  }

  function consumeItem(bytes32 itemID)
  public
  returns (bytes32)
  {
    require(ItemComponent.get(itemID), "not an item");
    bytes32 playerID = bytes32(uint256(uint160(_msgSender())));

    LocationComponent.set(itemID, bytes32(0));
    OwnerComponent.set(itemID, bytes32(0));

    return itemID;
  }
}
