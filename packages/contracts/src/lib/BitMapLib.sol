// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library BitMapLib {
  function setRevealedCell(uint256[] memory self, uint256 bitIndex, bool revealed) internal {
    uint256 arrayRow = bitIndex / 1024;
    uint256 arrayColumn = bitIndex % 1024;
    self[arrayRow] = (self[arrayRow] & ~(1 << arrayColumn)) | (uint256(revealed ? 1 : 0) << arrayColumn);
  }

  function isCellRevealed(uint256[] memory self, uint256 bitIndex) internal pure returns (bool) {
    uint256 arrayRow = bitIndex / 256;
    uint256 arrayColumn = bitIndex % 256;
    return (self[arrayRow] >> arrayColumn) & 1 != 0;
  }

  function hasRevealedCell(uint256[] memory self, uint256 offSetIndex) internal pure returns (bool) {
    uint256 arrayRow = offSetIndex / 256;
    uint256 arrayColumn = offSetIndex % 256;
    return (self[arrayRow] >> offSetIndex) > 0;
  }
}
