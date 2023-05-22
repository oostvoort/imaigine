// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library ArrayLib {
  function encode(bytes32[] memory array) internal pure returns (bytes memory) {
    return abi.encode(array);
  }

  function encode(string[] memory array) internal pure returns (bytes memory) {
    return abi.encode(array);
  }

  function decodeBytes32Array(bytes memory data) internal pure returns (bytes32[] memory) {
    if (data.length == 0) return new bytes32[](0);
    return abi.decode(data, (bytes32[]));
  }

  function decodeStringArray(bytes memory data) internal pure returns (string[] memory) {
    if (data.length == 0) return new string[](0);
    return abi.decode(data, (string[]));
  }

  function shiftIndexToLast(bytes32[] memory array, uint256 index) internal pure returns (bytes32[] memory){
    require(array.length > 0, "array is empty");
    bytes32 element = array[index];
    for(uint256 i=index; i<array.length; i++) {
      array[i] = array[i+1];
    }
    array[array.length - 1] = element;
    return array;
  }

  function findIndex(bytes32[] memory array, bytes32 data) internal pure returns (int256 index) {
    // not found
    index = -1;
    for(uint256 i=0; i<array.length; i++) {
      if (array[i] == data) index = int256(i);
    }
  }

  function push(bytes32[] memory array, bytes32 data) internal pure returns (bytes32[] memory){
    bytes32[] memory new_array = new bytes32[](array.length + 1);
    for(uint256 i=0; i<array.length; i++) {
      new_array[i] = array[i];
    }
    // put to last index
    new_array[new_array.length - 1] = data;
    return new_array;
  }
}
