// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  AttributeUintComponent,
  AttributeIntComponent,
  AttributeStringComponent
} from "../src/codegen/Tables.sol";

contract AttributesTest is MudV2Test {
  IWorld public world;

  bytes32 playerID;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function test_SetAttributesUint() public {
    string[] memory attrNames = new string[](5);
    attrNames[0] = "stats0";
    attrNames[1] = "stats1";
    attrNames[2] = "stats2";
    attrNames[3] = "stats3";
    attrNames[4] = "stats4";

    uint256[] memory attrValues = new uint256[](5);
    attrValues[0] = 100;
    attrValues[1] = 100;
    attrValues[2] = 100;
    attrValues[3] = 100;
    attrValues[4] = 100;

    world.setAttributesUint(
      playerID,
      attrNames,
      attrValues
    );

    for(uint256 i=0; i<attrNames.length; i++) {
      bytes32 attrNameID = bytes32(abi.encodePacked(attrNames[i]));
      uint256 attrValue = AttributeUintComponent.get(world, playerID, attrNameID);

      assertEq(attrValue, attrValues[i]);
    }
  }

  function test_SetAttributesInt() public {
    string[] memory attrNames = new string[](5);
    attrNames[0] = "stats0";
    attrNames[1] = "stats1";
    attrNames[2] = "stats2";
    attrNames[3] = "stats3";
    attrNames[4] = "stats4";

    int256[] memory attrValues = new int256[](5);
    attrValues[0] = 100;
    attrValues[1] = 100;
    attrValues[2] = -100;
    attrValues[3] = 100;
    attrValues[4] = -100;

    world.setAttributesInt(playerID, attrNames, attrValues);

    for(uint256 i=0; i<attrNames.length; i++) {
      bytes32 attrNameID = bytes32(abi.encodePacked(attrNames[i]));
      int256 attrValue = AttributeIntComponent.get(world, playerID, attrNameID);

      assertEq(attrValue, attrValues[i]);
    }
  }

  function test_SetAttributesString() public {
    string[] memory attrNames = new string[](5);
    attrNames[0] = "stats0";
    attrNames[1] = "stats1";
    attrNames[2] = "stats2";
    attrNames[3] = "stats3";
    attrNames[4] = "stats4";

    string[] memory attrValues = new string[](5);
    attrValues[0] = "value0";
    attrValues[1] = "value1";
    attrValues[2] = "value2";
    attrValues[3] = "value3";
    attrValues[4] = "value4";

    world.setAttributesString(playerID, attrNames, attrValues);

    for(uint256 i=0; i<attrNames.length; i++) {
      bytes32 attrNameID = bytes32(abi.encodePacked(attrNames[i]));
      string memory attrValue = AttributeStringComponent.get(world, playerID, attrNameID);

      assertEq(attrValue, attrValues[i]);
    }
  }
}
