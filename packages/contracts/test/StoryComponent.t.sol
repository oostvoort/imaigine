// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  LocationComponent,
  SummaryComponent,
  ImageComponent
} from "../src/codegen/Tables.sol";

import { Constants } from "../src/lib/Constants.sol";

contract StoryComponentTest is MudV2Test {
  IWorld public world;

  address constant public DEPLOYER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

  bytes32 public playerID;
  bytes32 public mockLocationID;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    vm.prank(DEPLOYER, DEPLOYER);
    world.grantAccess(0, 0, address(this));

    mockLocationID = world.createLocation("A", "B", "C");
    playerID = world.createPlayer("Lyra", "human", "0xabc", mockLocationID);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function test_SetActions() public {
    bytes32[] memory actionIDs = new bytes32[](2);
    bytes[] memory actions = new bytes[](2);

    actionIDs[0] = keccak256(abi.encode("options.locations.0"));
    actions[0] = "Valley of Iron";

    actionIDs[1] = keccak256(abi.encode("options.locations.1"));
    actions[1] = "Central Town";

    // define player's selections: location, npc's, items
    // normally called by authors (eg. ai responses)
    world.setPlayerStory(playerID, actionIDs, actions);

    // selected first location

//    string memory newLocation = LocationComponent.get(world, playerID);
//    assertEq("Valley of Iron", newLocation);
  }
}
