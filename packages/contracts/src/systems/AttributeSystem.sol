// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import {
  AttributeUintComponent,
  AttributeIntComponent,
  AttributeStringComponent
} from "../codegen/Tables.sol";

contract AttributeSystem is System {
  function setAttributesUint(bytes32 entityID, string[] memory names, uint256[] memory values) public {
    require(names.length == values.length, "invariance to names and values length");

    for(uint256 i=0; i<names.length; i++) {
      bytes32 attrID = bytes32(abi.encodePacked(names[i]));
      AttributeUintComponent.set(entityID, attrID, values[i]);
    }
  }

  function setAttributesInt(bytes32 entityID, string[] memory names, int256[] memory values) public {
    require(names.length == values.length, "invariance to names and values length");

    for(uint256 i=0; i<names.length; i++) {
      bytes32 attrID = bytes32(abi.encodePacked(names[i]));
      AttributeIntComponent.set(entityID, attrID, values[i]);
    }
  }

  function setAttributesString(bytes32 entityID, string[] memory names, string[] memory values) public {
    require(names.length == values.length, "invariance to names and values length");

    for(uint256 i=0; i<names.length; i++) {
      bytes32 attrID = bytes32(abi.encodePacked(names[i]));
      AttributeStringComponent.set(entityID, attrID, values[i]);
    }
  }
}
