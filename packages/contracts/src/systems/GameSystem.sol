// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {System} from "@latticexyz/world/src/System.sol";
import {addressToEntityKey} from "../addressToEntityKey.sol";
import {CharacterStoryComponentData, CharacterStatsComponentData, Player, CharacterStatsComponent, CharacterStoryComponent} from "../codegen/Tables.sol";

contract GameSystem is System {
    function createPlayerCharacter(
        CharacterStoryComponentData memory story,
        CharacterStatsComponentData memory stats
    ) public {
        bytes32 player = addressToEntityKey(address(_msgSender()));
        require(!Player.get(player), "already spawned");

        // Mark character as player controlled
        Player.set(player, true);

        CharacterStatsComponent.set(
            player,
            stats.dexterity,
            stats.strength,
            stats.constitution,
            stats.intelligence,
            stats.charisma,
            stats.wisdom
        );

        CharacterStoryComponent.set(
            player,
            story.name,
            story.pet,
            story.age,
            story.food,
            story.universe,
            story.activity,
            story.alignment
        );
    }
}
