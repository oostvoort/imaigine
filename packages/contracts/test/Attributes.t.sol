// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  AttributeUintComponent,
  AttributeStringComponent
} from "../src/codegen/Tables.sol";

contract AttributesTest is MudV2Test {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

//  function testFuzz_SetAttributesUint(bytes32 playerID, string[] memory attrNames, uint256[] memory attrValues) public {
//    vm.assume(playerID != 0);
//    vm.assume(attrNames.length > 0);
//    vm.assume(attrValues.length > 0);
//    vm.assume(attrNames.length == attrValues.length);
//
//    world.setAttributesUint(playerID, attrNames, attrValues);
//
//    for(uint256 i=0; i<attrNames.length; i++) {
//      bytes32 attrNameID = keccak256(abi.encodePacked(attrNames[i]));
//      uint256 attrValue = AttributeUintComponent.get(world, playerID, attrNameID);
//
//      assertEq(attrValue, attrValues[i]);
//    }
//  }
//
//  function testFuzz_SetAttributesUint(bytes32 playerID, string[] memory attrNames, string[] memory attrValues) public {
//    vm.assume(playerID != 0);
//    vm.assume(attrNames.length > 0);
//    vm.assume(attrValues.length > 0);
//    vm.assume(attrNames.length == attrValues.length);
//
//    world.setAttributesString(playerID, attrNames, attrValues);
//
//    for(uint256 i=0; i<attrNames.length; i++) {
//      bytes32 attrNameID = keccak256(abi.encodePacked(attrNames[i]));
//      string memory attrValue = AttributeStringComponent.get(world, playerID, attrNameID);
//
//      assertEq(attrValue, attrValues[i]);
//    }
//  }
}