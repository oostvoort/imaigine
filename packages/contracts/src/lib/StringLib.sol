// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library StringLib {
  function isEmpty(string memory str) internal pure returns (bool) {
    return bytes(str).length == 0;
  }

  function length(string memory str) internal pure returns (uint256) {
    return bytes(str).length;
  }
}
