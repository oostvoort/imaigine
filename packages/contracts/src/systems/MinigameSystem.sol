// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  BattleQueueComponent,
  BattleComponent,
  BattleComponentData
} from "../codegen/Tables.sol";

import { BattleStatus } from "../codegen/Types.sol";

contract MinigameSystem is System {

    /// This function sets a player in the battle queue for a specific location.
    /// It first checks if the player is already in the queue by calling the "get" function from the BattleQueueComponent contract and
    /// then comparing the result to 0. If the player is not already in the queue,
    /// the function sets the player in the queue by calling the "set" function from the BattleQueueComponent contract with the given
    /// locationId and playerId. Finally, it returns the playerId of the player that was just added to the queue.
    function setQueue(bytes32 playerId, bytes32 locationId) public returns (bytes32) {

        require(BattleQueueComponent.get(locationId) == 0, "player is already in the queue");

        BattleQueueComponent.set(locationId, playerId);

        return BattleQueueComponent.get(locationId);
    }

    /// This function sets up a battle match between two players. It takes in the IDs of the player, location, and opponent as parameters.
    /// First, it checks if the player is already in a battle by verifying their status. If the player is already in a battle, it throws an error.
    /// Next, it sets the battle component data for the player and location. It assigns the opponent ID, sets the status to "IN_BATTLE", and initializes the option and hashSalt values.
    /// Then, it deletes the record from the battle queue component for the specified location.
    /// Finally, it returns the battle component data for the player and location.
    function setMatch(bytes32 playerId, bytes32 locationId, bytes32 opponentId) public returns (BattleComponentData memory) {

        require(BattleComponent.get(playerId, locationId).status != BattleStatus.IN_BATTLE, "player is already in the battle");

        BattleComponent.set(playerId, locationId, BattleComponentData({
            opponent: opponentId,
            status: BattleStatus.IN_BATTLE,
            option: "",
            hashSalt: ""
        }));

        BattleQueueComponent.deleteRecord(locationId);

        return BattleComponent.get(playerId, locationId);
    }


    /// This function sets the betting option for a player in a battle.
    /// It takes in the player ID, location ID, and a hashed option as parameters.
    /// It first checks if the player exists in the match by verifying their status. If the player exists,
    /// it updates their betting option with the provided hash. Finally,
    /// it returns the updated battle component data for the player in the specified location.
    function setBetting(bytes32 playerId, bytes32 locationId, bytes32 hashOption) public returns (BattleComponentData memory) {

      require(BattleComponent.get(playerId, locationId).status == BattleStatus.IN_BATTLE, "player doesn't exist in the match");

      BattleComponent.setOption(playerId, locationId, hashOption);

      return BattleComponent.get(playerId, locationId);
    }
}
