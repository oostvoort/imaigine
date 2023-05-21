// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { console } from "forge-std/console.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  ControllerComponent
} from "../src/codegen/Tables.sol";

contract ControllerSystemTest is MudV2Test {
  IWorld public world;

  address constant public DEPLOYER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function test_SetOracle() public {
    address oracle = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    vm.prank(DEPLOYER, DEPLOYER);
    world.setOracle(oracle);

    address newOracle = ControllerComponent.get(world);

    assertEq(oracle, newOracle);
  }

  function test_revert_SetOracle() public {
    address oracle = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    vm.expectRevert();
    world.setOracle(oracle);
  }
}
