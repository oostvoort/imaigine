// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";

import { Oracle } from "../src/Oracle.sol";

contract Deploy is Script {
  function run() external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    Oracle oracle = new Oracle();

    console.log("Deployed Oracle:", address(oracle));

    vm.stopBroadcast();
  }
}
