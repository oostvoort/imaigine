// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library BitMapLib {
  function setRevealedCell(uint256 self, uint256 bitIndex, bool revealed) internal {
    self = (self & ~(1 << bitIndex)) | (uint256(revealed ? 1 : 0) << bitIndex);
  }

  function isCellRevealed(uint256 self, uint256 bitIndex) internal pure returns (bool) {
    return (self >> bitIndex) & 1 != 0;
  }

  function hasRevealedCell(uint256 self, uint256 offSetIndex) internal pure returns (bool) {
    return (self >> offSetIndex) > 0;
  }
}
