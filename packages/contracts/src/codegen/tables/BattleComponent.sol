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

// Import user types
import { BattleOptions, BattleStatus, BattleOutcomeType } from "./../Types.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("BattleComponent")));
bytes32 constant BattleComponentTableId = _tableId;

struct BattleComponentData {
  bytes32 opponent;
  BattleOptions option;
  bytes32 hashedOption;
  BattleStatus status;
  uint256 deadline;
  BattleOutcomeType outcome;
  string hashSalt;
}

library BattleComponent {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](7);
    _schema[0] = SchemaType.BYTES32;
    _schema[1] = SchemaType.UINT8;
    _schema[2] = SchemaType.BYTES32;
    _schema[3] = SchemaType.UINT8;
    _schema[4] = SchemaType.UINT256;
    _schema[5] = SchemaType.UINT8;
    _schema[6] = SchemaType.STRING;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.BYTES32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](7);
    _fieldNames[0] = "opponent";
    _fieldNames[1] = "option";
    _fieldNames[2] = "hashedOption";
    _fieldNames[3] = "status";
    _fieldNames[4] = "deadline";
    _fieldNames[5] = "outcome";
    _fieldNames[6] = "hashSalt";
    return ("BattleComponent", _fieldNames);
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

  /** Get opponent */
  function getOpponent(bytes32 key) internal view returns (bytes32 opponent) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (Bytes.slice32(_blob, 0));
  }

  /** Get opponent (using the specified store) */
  function getOpponent(IStore _store, bytes32 key) internal view returns (bytes32 opponent) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (Bytes.slice32(_blob, 0));
  }

  /** Set opponent */
  function setOpponent(bytes32 key, bytes32 opponent) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((opponent)));
  }

  /** Set opponent (using the specified store) */
  function setOpponent(IStore _store, bytes32 key, bytes32 opponent) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((opponent)));
  }

  /** Get option */
  function getOption(bytes32 key) internal view returns (BattleOptions option) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return BattleOptions(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Get option (using the specified store) */
  function getOption(IStore _store, bytes32 key) internal view returns (BattleOptions option) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return BattleOptions(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Set option */
  function setOption(bytes32 key, BattleOptions option) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked(uint8(option)));
  }

  /** Set option (using the specified store) */
  function setOption(IStore _store, bytes32 key, BattleOptions option) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked(uint8(option)));
  }

  /** Get hashedOption */
  function getHashedOption(bytes32 key) internal view returns (bytes32 hashedOption) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 2);
    return (Bytes.slice32(_blob, 0));
  }

  /** Get hashedOption (using the specified store) */
  function getHashedOption(IStore _store, bytes32 key) internal view returns (bytes32 hashedOption) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 2);
    return (Bytes.slice32(_blob, 0));
  }

  /** Set hashedOption */
  function setHashedOption(bytes32 key, bytes32 hashedOption) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setField(_tableId, _keyTuple, 2, abi.encodePacked((hashedOption)));
  }

  /** Set hashedOption (using the specified store) */
  function setHashedOption(IStore _store, bytes32 key, bytes32 hashedOption) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setField(_tableId, _keyTuple, 2, abi.encodePacked((hashedOption)));
  }

  /** Get status */
  function getStatus(bytes32 key) internal view returns (BattleStatus status) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 3);
    return BattleStatus(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Get status (using the specified store) */
  function getStatus(IStore _store, bytes32 key) internal view returns (BattleStatus status) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 3);
    return BattleStatus(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Set status */
  function setStatus(bytes32 key, BattleStatus status) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setField(_tableId, _keyTuple, 3, abi.encodePacked(uint8(status)));
  }

  /** Set status (using the specified store) */
  function setStatus(IStore _store, bytes32 key, BattleStatus status) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setField(_tableId, _keyTuple, 3, abi.encodePacked(uint8(status)));
  }

  /** Get deadline */
  function getDeadline(bytes32 key) internal view returns (uint256 deadline) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 4);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get deadline (using the specified store) */
  function getDeadline(IStore _store, bytes32 key) internal view returns (uint256 deadline) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 4);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set deadline */
  function setDeadline(bytes32 key, uint256 deadline) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setField(_tableId, _keyTuple, 4, abi.encodePacked((deadline)));
  }

  /** Set deadline (using the specified store) */
  function setDeadline(IStore _store, bytes32 key, uint256 deadline) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setField(_tableId, _keyTuple, 4, abi.encodePacked((deadline)));
  }

  /** Get outcome */
  function getOutcome(bytes32 key) internal view returns (BattleOutcomeType outcome) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 5);
    return BattleOutcomeType(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Get outcome (using the specified store) */
  function getOutcome(IStore _store, bytes32 key) internal view returns (BattleOutcomeType outcome) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 5);
    return BattleOutcomeType(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Set outcome */
  function setOutcome(bytes32 key, BattleOutcomeType outcome) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setField(_tableId, _keyTuple, 5, abi.encodePacked(uint8(outcome)));
  }

  /** Set outcome (using the specified store) */
  function setOutcome(IStore _store, bytes32 key, BattleOutcomeType outcome) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setField(_tableId, _keyTuple, 5, abi.encodePacked(uint8(outcome)));
  }

  /** Get hashSalt */
  function getHashSalt(bytes32 key) internal view returns (string memory hashSalt) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 6);
    return (string(_blob));
  }

  /** Get hashSalt (using the specified store) */
  function getHashSalt(IStore _store, bytes32 key) internal view returns (string memory hashSalt) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 6);
    return (string(_blob));
  }

  /** Set hashSalt */
  function setHashSalt(bytes32 key, string memory hashSalt) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setField(_tableId, _keyTuple, 6, bytes((hashSalt)));
  }

  /** Set hashSalt (using the specified store) */
  function setHashSalt(IStore _store, bytes32 key, string memory hashSalt) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setField(_tableId, _keyTuple, 6, bytes((hashSalt)));
  }

  /** Get the length of hashSalt */
  function lengthHashSalt(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 6, getSchema());
    return _byteLength / 1;
  }

  /** Get the length of hashSalt (using the specified store) */
  function lengthHashSalt(IStore _store, bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 6, getSchema());
    return _byteLength / 1;
  }

  /** Get an item of hashSalt (unchecked, returns invalid data if index overflows) */
  function getItemHashSalt(bytes32 key, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getFieldSlice(_tableId, _keyTuple, 6, getSchema(), _index * 1, (_index + 1) * 1);
    return (string(_blob));
  }

  /** Get an item of hashSalt (using the specified store) (unchecked, returns invalid data if index overflows) */
  function getItemHashSalt(IStore _store, bytes32 key, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 6, getSchema(), _index * 1, (_index + 1) * 1);
    return (string(_blob));
  }

  /** Push a slice to hashSalt */
  function pushHashSalt(bytes32 key, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.pushToField(_tableId, _keyTuple, 6, bytes((_slice)));
  }

  /** Push a slice to hashSalt (using the specified store) */
  function pushHashSalt(IStore _store, bytes32 key, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.pushToField(_tableId, _keyTuple, 6, bytes((_slice)));
  }

  /** Pop a slice from hashSalt */
  function popHashSalt(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.popFromField(_tableId, _keyTuple, 6, 1);
  }

  /** Pop a slice from hashSalt (using the specified store) */
  function popHashSalt(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.popFromField(_tableId, _keyTuple, 6, 1);
  }

  /** Update a slice of hashSalt at `_index` */
  function updateHashSalt(bytes32 key, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.updateInField(_tableId, _keyTuple, 6, _index * 1, bytes((_slice)));
  }

  /** Update a slice of hashSalt (using the specified store) at `_index` */
  function updateHashSalt(IStore _store, bytes32 key, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.updateInField(_tableId, _keyTuple, 6, _index * 1, bytes((_slice)));
  }

  /** Get the full data */
  function get(bytes32 key) internal view returns (BattleComponentData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store, bytes32 key) internal view returns (BattleComponentData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(
    bytes32 key,
    bytes32 opponent,
    BattleOptions option,
    bytes32 hashedOption,
    BattleStatus status,
    uint256 deadline,
    BattleOutcomeType outcome,
    string memory hashSalt
  ) internal {
    bytes memory _data = encode(opponent, option, hashedOption, status, deadline, outcome, hashSalt);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    bytes32 key,
    bytes32 opponent,
    BattleOptions option,
    bytes32 hashedOption,
    BattleStatus status,
    uint256 deadline,
    BattleOutcomeType outcome,
    string memory hashSalt
  ) internal {
    bytes memory _data = encode(opponent, option, hashedOption, status, deadline, outcome, hashSalt);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(bytes32 key, BattleComponentData memory _table) internal {
    set(
      key,
      _table.opponent,
      _table.option,
      _table.hashedOption,
      _table.status,
      _table.deadline,
      _table.outcome,
      _table.hashSalt
    );
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, bytes32 key, BattleComponentData memory _table) internal {
    set(
      _store,
      key,
      _table.opponent,
      _table.option,
      _table.hashedOption,
      _table.status,
      _table.deadline,
      _table.outcome,
      _table.hashSalt
    );
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal view returns (BattleComponentData memory _table) {
    // 99 is the total byte length of static data
    PackedCounter _encodedLengths = PackedCounter.wrap(Bytes.slice32(_blob, 99));

    _table.opponent = (Bytes.slice32(_blob, 0));

    _table.option = BattleOptions(uint8(Bytes.slice1(_blob, 32)));

    _table.hashedOption = (Bytes.slice32(_blob, 33));

    _table.status = BattleStatus(uint8(Bytes.slice1(_blob, 65)));

    _table.deadline = (uint256(Bytes.slice32(_blob, 66)));

    _table.outcome = BattleOutcomeType(uint8(Bytes.slice1(_blob, 98)));

    // Store trims the blob if dynamic fields are all empty
    if (_blob.length > 99) {
      uint256 _start;
      // skip static data length + dynamic lengths word
      uint256 _end = 131;

      _start = _end;
      _end += _encodedLengths.atIndex(0);
      _table.hashSalt = (string(SliceLib.getSubslice(_blob, _start, _end).toBytes()));
    }
  }

  /** Tightly pack full data using this table's schema */
  function encode(
    bytes32 opponent,
    BattleOptions option,
    bytes32 hashedOption,
    BattleStatus status,
    uint256 deadline,
    BattleOutcomeType outcome,
    string memory hashSalt
  ) internal view returns (bytes memory) {
    uint40[] memory _counters = new uint40[](1);
    _counters[0] = uint40(bytes(hashSalt).length);
    PackedCounter _encodedLengths = PackedCounterLib.pack(_counters);

    return
      abi.encodePacked(
        opponent,
        option,
        hashedOption,
        status,
        deadline,
        outcome,
        _encodedLengths.unwrap(),
        bytes((hashSalt))
      );
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(bytes32 key) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;
  }

  /* Delete all data for given keys */
  function deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.deleteRecord(_tableId, _keyTuple);
  }
}
