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

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("SingleInteractio")));
bytes32 constant SingleInteractionComponentTableId = _tableId;

struct SingleInteractionComponentData {
  bool available;
  uint256 choice;
  uint256 processingTimeout;
}

library SingleInteractionComponent {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](3);
    _schema[0] = SchemaType.BOOL;
    _schema[1] = SchemaType.UINT256;
    _schema[2] = SchemaType.UINT256;

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
    string[] memory _fieldNames = new string[](3);
    _fieldNames[0] = "available";
    _fieldNames[1] = "choice";
    _fieldNames[2] = "processingTimeout";
    return ("SingleInteractionComponent", _fieldNames);
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

  /** Get available */
  function getAvailable(bytes32 player, bytes32 interactable) internal view returns (bool available) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Get available (using the specified store) */
  function getAvailable(IStore _store, bytes32 player, bytes32 interactable) internal view returns (bool available) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Set available */
  function setAvailable(bytes32 player, bytes32 interactable, bool available) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((available)));
  }

  /** Set available (using the specified store) */
  function setAvailable(IStore _store, bytes32 player, bytes32 interactable, bool available) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((available)));
  }

  /** Get choice */
  function getChoice(bytes32 player, bytes32 interactable) internal view returns (uint256 choice) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get choice (using the specified store) */
  function getChoice(IStore _store, bytes32 player, bytes32 interactable) internal view returns (uint256 choice) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set choice */
  function setChoice(bytes32 player, bytes32 interactable, uint256 choice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked((choice)));
  }

  /** Set choice (using the specified store) */
  function setChoice(IStore _store, bytes32 player, bytes32 interactable, uint256 choice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked((choice)));
  }

  /** Get processingTimeout */
  function getProcessingTimeout(
    bytes32 player,
    bytes32 interactable
  ) internal view returns (uint256 processingTimeout) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 2);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get processingTimeout (using the specified store) */
  function getProcessingTimeout(
    IStore _store,
    bytes32 player,
    bytes32 interactable
  ) internal view returns (uint256 processingTimeout) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 2);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set processingTimeout */
  function setProcessingTimeout(bytes32 player, bytes32 interactable, uint256 processingTimeout) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    StoreSwitch.setField(_tableId, _keyTuple, 2, abi.encodePacked((processingTimeout)));
  }

  /** Set processingTimeout (using the specified store) */
  function setProcessingTimeout(
    IStore _store,
    bytes32 player,
    bytes32 interactable,
    uint256 processingTimeout
  ) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    _store.setField(_tableId, _keyTuple, 2, abi.encodePacked((processingTimeout)));
  }

  /** Get the full data */
  function get(
    bytes32 player,
    bytes32 interactable
  ) internal view returns (SingleInteractionComponentData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(
    IStore _store,
    bytes32 player,
    bytes32 interactable
  ) internal view returns (SingleInteractionComponentData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(
    bytes32 player,
    bytes32 interactable,
    bool available,
    uint256 choice,
    uint256 processingTimeout
  ) internal {
    bytes memory _data = encode(available, choice, processingTimeout);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    bytes32 player,
    bytes32 interactable,
    bool available,
    uint256 choice,
    uint256 processingTimeout
  ) internal {
    bytes memory _data = encode(available, choice, processingTimeout);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(bytes32 player, bytes32 interactable, SingleInteractionComponentData memory _table) internal {
    set(player, interactable, _table.available, _table.choice, _table.processingTimeout);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(
    IStore _store,
    bytes32 player,
    bytes32 interactable,
    SingleInteractionComponentData memory _table
  ) internal {
    set(_store, player, interactable, _table.available, _table.choice, _table.processingTimeout);
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (SingleInteractionComponentData memory _table) {
    _table.available = (_toBool(uint8(Bytes.slice1(_blob, 0))));

    _table.choice = (uint256(Bytes.slice32(_blob, 1)));

    _table.processingTimeout = (uint256(Bytes.slice32(_blob, 33)));
  }

  /** Tightly pack full data using this table's schema */
  function encode(bool available, uint256 choice, uint256 processingTimeout) internal view returns (bytes memory) {
    return abi.encodePacked(available, choice, processingTimeout);
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(bytes32 player, bytes32 interactable) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;
  }

  /* Delete all data for given keys */
  function deleteRecord(bytes32 player, bytes32 interactable) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, bytes32 player, bytes32 interactable) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = player;
    _keyTuple[1] = interactable;

    _store.deleteRecord(_tableId, _keyTuple);
  }
}

function _toBool(uint8 value) pure returns (bool result) {
  assembly {
    result := value
  }
}
