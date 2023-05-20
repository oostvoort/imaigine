// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("AttributeStringC")));
bytes32 constant AttributeStringComponentTableId = _tableId;

library AttributeStringComponent {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.STRING;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](2);
    _schema[0] = SchemaType.BYTES32;
    _schema[1] = SchemaType.BYTES32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](1);
    _fieldNames[0] = "value";
    return ("AttributeStringComponent", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get value */
  function get(bytes32 entityID, bytes32 attributeID) internal view returns (string memory value) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /** Get value (using the specified store) */
  function get(IStore _store, bytes32 entityID, bytes32 attributeID) internal view returns (string memory value) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /** Set value */
  function set(bytes32 entityID, bytes32 attributeID, string memory value) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    StoreSwitch.setField(_tableId, _keyTuple, 0, bytes((value)));
  }

  /** Set value (using the specified store) */
  function set(IStore _store, bytes32 entityID, bytes32 attributeID, string memory value) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    _store.setField(_tableId, _keyTuple, 0, bytes((value)));
  }

  /** Get the length of value */
  function length(bytes32 entityID, bytes32 attributeID) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 0, getSchema());
    return _byteLength / 1;
  }

  /** Get the length of value (using the specified store) */
  function length(IStore _store, bytes32 entityID, bytes32 attributeID) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 0, getSchema());
    return _byteLength / 1;
  }

  /** Get an item of value (unchecked, returns invalid data if index overflows) */
  function getItem(bytes32 entityID, bytes32 attributeID, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    bytes memory _blob = StoreSwitch.getFieldSlice(_tableId, _keyTuple, 0, getSchema(), _index * 1, (_index + 1) * 1);
    return (string(_blob));
  }

  /** Get an item of value (using the specified store) (unchecked, returns invalid data if index overflows) */
  function getItem(
    IStore _store,
    bytes32 entityID,
    bytes32 attributeID,
    uint256 _index
  ) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 0, getSchema(), _index * 1, (_index + 1) * 1);
    return (string(_blob));
  }

  /** Push a slice to value */
  function push(bytes32 entityID, bytes32 attributeID, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    StoreSwitch.pushToField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /** Push a slice to value (using the specified store) */
  function push(IStore _store, bytes32 entityID, bytes32 attributeID, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    _store.pushToField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /** Pop a slice from value */
  function pop(bytes32 entityID, bytes32 attributeID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    StoreSwitch.popFromField(_tableId, _keyTuple, 0, 1);
  }

  /** Pop a slice from value (using the specified store) */
  function pop(IStore _store, bytes32 entityID, bytes32 attributeID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    _store.popFromField(_tableId, _keyTuple, 0, 1);
  }

  /** Update a slice of value at `_index` */
  function update(bytes32 entityID, bytes32 attributeID, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    StoreSwitch.updateInField(_tableId, _keyTuple, 0, _index * 1, bytes((_slice)));
  }

  /** Update a slice of value (using the specified store) at `_index` */
  function update(IStore _store, bytes32 entityID, bytes32 attributeID, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    _store.updateInField(_tableId, _keyTuple, 0, _index * 1, bytes((_slice)));
  }

  /** Tightly pack full data using this table's schema */
  function encode(string memory value) internal view returns (bytes memory) {
    uint40[] memory _counters = new uint40[](1);
    _counters[0] = uint40(bytes(value).length);
    PackedCounter _encodedLengths = PackedCounterLib.pack(_counters);

    return abi.encodePacked(_encodedLengths.unwrap(), bytes((value)));
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(bytes32 entityID, bytes32 attributeID) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));
  }

  /* Delete all data for given keys */
  function deleteRecord(bytes32 entityID, bytes32 attributeID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, bytes32 entityID, bytes32 attributeID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32((entityID));
    _keyTuple[1] = bytes32((attributeID));

    _store.deleteRecord(_tableId, _keyTuple);
  }
}
